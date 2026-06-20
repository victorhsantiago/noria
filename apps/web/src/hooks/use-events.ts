import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { EventSchema } from '@noria/schemas';
import { type Attendees, type Events, generateOccurrencesOneYear } from '@noria/database';

export const useEventById = (id: string) => {
	return useSuspenseQuery({
		queryKey: ['event', id],
		queryFn: async () => {
			const supabase = createClient();
			const { data: event, error } = await supabase
				.from('events')
				.select(
					`
			*,
			attendees (
			  id,
			  guest_name,
			  email,
			  rsvp_status,
			  user_id,
			  created_at
			)
		  `,
				)
				.eq('id', id)
				.single();

			if (error || !event) {
				return null;
			}

			const attendees = event.attendees || [];
			return {
				...event,
				attendees,
				goingCount: attendees.filter(
					(a: { rsvp_status: Attendees['rsvp_status'] }) => a.rsvp_status === 'Going',
				).length,
				maybeCount: attendees.filter(
					(a: { rsvp_status: Attendees['rsvp_status'] }) => a.rsvp_status === 'Maybe',
				).length,
				notGoingCount: attendees.filter(
					(a: { rsvp_status: Attendees['rsvp_status'] }) => a.rsvp_status === 'Not Going',
				).length,
			};
		},
	});
};

export const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				return { error: 'You must be logged in to create an event.' };
			}

			const rawData = {
				title: formData.get('title')?.toString() || '',
				description: formData.get('description')?.toString() || undefined,
				location: formData.get('location')?.toString() || '',
				start_datetime: formData.get('start_datetime')?.toString() || '',
				duration: formData.get('duration')?.toString() || '',
				frequency: formData.get('frequency')?.toString() || '',
			};

			const parsed = EventSchema.parse(rawData);
			const isRecurring = parsed.frequency !== 'not repeat';
			const recurrence_group_id = isRecurring ? crypto.randomUUID() : null;

			const { data: anchorEvent, error } = await supabase
				.from('events')
				.insert({
					title: parsed.title,
					description: parsed.description || null,
					location: parsed.location,
					start_datetime: parsed.start_datetime,
					duration: parsed.duration,
					frequency: parsed.frequency,
					organizer_id: user.id,
					recurrence_group_id,
				})
				.select()
				.single();

			if (error || !anchorEvent) {
				return { error: error ? error.message : 'Failed to create event.' };
			}

			if (isRecurring) {
				const occurrences = generateOccurrencesOneYear(new Date(parsed.start_datetime), parsed.frequency);
				if (occurrences.length > 0) {
					const batchData = occurrences.map((occ) => ({
						title: parsed.title,
						description: parsed.description || null,
						location: parsed.location,
						start_datetime: occ.toISOString(),
						duration: parsed.duration,
						frequency: parsed.frequency,
						organizer_id: user.id,
						parent_event_id: anchorEvent.id,
						recurrence_group_id,
					}));

					const { error: batchError } = await supabase
						.from('events')
						.insert(batchData);

					if (batchError) {
						await supabase.from('events').delete().eq('id', anchorEvent.id);
						return { error: `Failed to create recurring occurrences: ${batchError.message}` };
					}
				}
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};

export const useUpdateEvent = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				return { error: 'You must be logged in to update an event.' };
			}

			const updateType = formData.get('update_type')?.toString() || 'single';

			const rawData = {
				title: formData.get('title')?.toString() || '',
				description: formData.get('description')?.toString() || undefined,
				location: formData.get('location')?.toString() || '',
				start_datetime: formData.get('start_datetime')?.toString() || '',
				duration: formData.get('duration')?.toString() || '',
				frequency: formData.get('frequency')?.toString() || '',
			};

			const parsed = EventSchema.parse(rawData);

			// Fetch existing event to inspect details
			const { data: currentEvent, error: fetchError } = await supabase
				.from('events')
				.select('id, parent_event_id, recurrence_group_id, start_datetime')
				.eq('id', id)
				.single();

			if (fetchError || !currentEvent) {
				return { error: fetchError ? fetchError.message : 'Event not found.' };
			}

			if (updateType === 'single') {
				const updateData: Partial<Events> = {
					title: parsed.title,
					description: parsed.description || null,
					location: parsed.location,
					start_datetime: parsed.start_datetime,
					duration: parsed.duration,
					frequency: parsed.frequency,
				};

				// Decouple from recurrence series if date shifts
				if (currentEvent.parent_event_id && parsed.start_datetime !== currentEvent.start_datetime) {
					updateData.parent_event_id = null;
				}

				const { error } = await supabase
					.from('events')
					.update(updateData)
					.eq('id', id)
					.eq('organizer_id', user.id);

				if (error) {
					return { error: error.message };
				}
			} else {
				// updateType === 'future'
				if (currentEvent.recurrence_group_id) {
					const oldStart = new Date(currentEvent.start_datetime).getTime();
					const newStart = new Date(parsed.start_datetime).getTime();
					const offsetMs = newStart - oldStart;

					if (offsetMs === 0) {
						// Simple batch update
						const { error } = await supabase
							.from('events')
							.update({
								title: parsed.title,
								description: parsed.description || null,
								location: parsed.location,
								duration: parsed.duration,
								frequency: parsed.frequency,
							})
							.eq('recurrence_group_id', currentEvent.recurrence_group_id)
							.gte('start_datetime', currentEvent.start_datetime)
							.eq('organizer_id', user.id);

						if (error) {
							return { error: error.message };
						}
					} else {
						// Shift times and update each event
						const { data: futureEvents, error: fetchFutureError } = await supabase
							.from('events')
							.select('id, start_datetime')
							.eq('recurrence_group_id', currentEvent.recurrence_group_id)
							.gte('start_datetime', currentEvent.start_datetime)
							.eq('organizer_id', user.id);

						if (fetchFutureError || !futureEvents) {
							return { error: fetchFutureError ? fetchFutureError.message : 'No future occurrences found.' };
						}

						const updatePromises = futureEvents.map((ev) => {
							const oldEvTime = new Date(ev.start_datetime).getTime();
							const newEvTime = new Date(oldEvTime + offsetMs).toISOString();
							return supabase
								.from('events')
								.update({
									title: parsed.title,
									description: parsed.description || null,
									location: parsed.location,
									start_datetime: newEvTime,
									duration: parsed.duration,
									frequency: parsed.frequency,
								})
								.eq('id', ev.id)
								.eq('organizer_id', user.id);
						});

						const results = await Promise.all(updatePromises);
						const errorResult = results.find((r) => r.error);
						if (errorResult && errorResult.error) {
							return { error: errorResult.error.message };
						}
					}
				} else {
					// Fallback if not part of a series
					const { error } = await supabase
						.from('events')
						.update({
							title: parsed.title,
							description: parsed.description || null,
							location: parsed.location,
							start_datetime: parsed.start_datetime,
							duration: parsed.duration,
							frequency: parsed.frequency,
						})
						.eq('id', id)
						.eq('organizer_id', user.id);

					if (error) {
						return { error: error.message };
					}
				}
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['event', id] });
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};

export const useDeleteEvent = (id: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (deleteType: 'single' | 'future' = 'single') => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				throw new Error('You must be logged in to delete an event.');
			}

			if (deleteType === 'single') {
				const { error } = await supabase
					.from('events')
					.delete()
					.eq('id', id)
					.eq('organizer_id', user.id);

				if (error) {
					throw new Error(error.message);
				}
			} else {
				// Fetch target event details
				const { data: currentEvent, error: fetchError } = await supabase
					.from('events')
					.select('recurrence_group_id, start_datetime')
					.eq('id', id)
					.single();

				if (fetchError || !currentEvent) {
					throw new Error(fetchError ? fetchError.message : 'Event not found.');
				}

				if (currentEvent.recurrence_group_id) {
					const { error } = await supabase
						.from('events')
						.delete()
						.eq('recurrence_group_id', currentEvent.recurrence_group_id)
						.gte('start_datetime', currentEvent.start_datetime)
						.eq('organizer_id', user.id);

					if (error) {
						throw new Error(error.message);
					}
				} else {
					// Fallback to single delete
					const { error } = await supabase
						.from('events')
						.delete()
						.eq('id', id)
						.eq('organizer_id', user.id);

					if (error) {
						throw new Error(error.message);
					}
				}
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};
