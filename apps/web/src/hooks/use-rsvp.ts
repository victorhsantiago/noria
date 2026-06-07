import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RsvpStatus } from '@noria/schemas';
import { toastQueue } from '@noria/ui';
import { createClient } from '@/utils/supabase/client';

const TOAST_MESSAGES: Record<RsvpStatus, { title: string; description: string }> = {
	Going: {
		title: 'Got it! 🎉',
		description: "Awesome! We can't wait to see you there.",
	},
	Maybe: {
		title: 'Noted! 📝',
		description: "We've got you down as a maybe. Hope you can make it!",
	},
	'Not Going': {
		title: 'Bummer! 😔',
		description: "Sorry you can't make it. Catch you next time!",
	},
} as const;

export const useRsvp = (eventId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (status: RsvpStatus) => {
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();
			const guestCookieKey = `noria_guest_rsvp_${eventId}`;

			let error;

			if (user) {
				const { error: upsertError } = await supabase.from('attendees').upsert(
					{
						event_id: eventId,
						user_id: user.id,
						guest_name: user.email || 'Unknown',
						rsvp_status: status,
					},
					{ onConflict: 'event_id,user_id' },
				);
				error = upsertError;
			} else {
				const existingAttendeeId = localStorage.getItem(guestCookieKey);

				if (existingAttendeeId) {
					const { error: updateError } = await supabase
						.from('attendees')
						.update({ rsvp_status: status })
						.eq('id', existingAttendeeId)
						.eq('event_id', eventId);

					error = updateError;
				} else {
					const { data: newAttendee, error: insertError } = await supabase
						.from('attendees')
						.insert({
							event_id: eventId,
							guest_name: 'Guest',
							rsvp_status: status,
						})
						.select('id')
						.single();

					error = insertError;

					if (newAttendee) {
						localStorage.setItem(guestCookieKey, newAttendee.id);
					}
				}
			}

			if (error) {
				console.error('Failed to RSVP:', error);
				throw new Error('Failed to RSVP');
			}
		},
		onSuccess: (_, status) => {
			const message = TOAST_MESSAGES[status];

			toastQueue.add(
				{
					title: message.title,
					description: message.description,
					type: 'success',
				},
				{ timeout: 5000 },
			);

			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			queryClient.invalidateQueries({ queryKey: ['event', eventId] });
		},
		onError: () => {
			toastQueue.add(
				{
					title: 'Oops!',
					description: 'We hit a snag saving your response. Give it another try!',
					type: 'danger',
				},
				{ timeout: 5000 },
			);
		},
	});

	return {
		isPending: mutation.isPending,
		handleRSVP: mutation.mutate,
	};
};
