import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { EventSchema } from '@noria/schemas';
import type { Attendees } from '@noria/database';

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

			const { error } = await supabase
				.from('events')
				.insert({
					title: parsed.title,
					description: parsed.description || null,
					location: parsed.location,
					start_datetime: parsed.start_datetime,
					duration: parsed.duration,
					frequency: parsed.frequency,
					organizer_id: user.id,
				})
				.select()
				.single();

			if (error) {
				return { error: error.message };
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

			const rawData = {
				title: formData.get('title')?.toString() || '',
				description: formData.get('description')?.toString() || undefined,
				location: formData.get('location')?.toString() || '',
				start_datetime: formData.get('start_datetime')?.toString() || '',
				duration: formData.get('duration')?.toString() || '',
				frequency: formData.get('frequency')?.toString() || '',
			};

			const parsed = EventSchema.parse(rawData);

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
		mutationFn: async () => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				throw new Error('You must be logged in to delete an event.');
			}

			const { error } = await supabase
				.from('events')
				.delete()
				.eq('id', id)
				.eq('organizer_id', user.id);

			if (error) {
				throw new Error(error.message);
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
		},
	});
};
