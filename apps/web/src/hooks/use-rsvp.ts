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

type RsvpVariables = {
	status: RsvpStatus;
	guestDetails?: {
		email: string;
		name?: string;
	};
};

export const useRsvp = (eventId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ status, guestDetails }: RsvpVariables) => {
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();
			const guestCookieKey = `noria_guest_rsvp_${eventId}`;

			const email = user ? user.email : guestDetails?.email;
			const guest_name = user
				? (user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Unknown')
				: (guestDetails?.name || guestDetails?.email || 'Guest');

			if (!email) {
				throw new Error('Email is required to RSVP');
			}

			// Find existing RSVP by event and email
			const { data: existing } = await supabase
				.from('attendees')
				.select('id')
				.eq('event_id', eventId)
				.eq('email', email)
				.maybeSingle();

			let error;
			let attendeeId = existing?.id;

			if (attendeeId) {
				const { error: updateError } = await supabase
					.from('attendees')
					.update({
						rsvp_status: status,
						guest_name,
						user_id: user?.id,
					})
					.eq('id', attendeeId);
				error = updateError;
			} else {
				const { data: inserted, error: insertError } = await supabase
					.from('attendees')
					.insert({
						event_id: eventId,
						email,
						guest_name,
						rsvp_status: status,
						user_id: user?.id,
					})
					.select('id')
					.single();
				error = insertError;
				attendeeId = inserted?.id;
			}

			if (error) {
				console.error('Failed to RSVP:', error);
				throw new Error('Failed to RSVP');
			}

			if (!user && attendeeId) {
				localStorage.setItem(
					guestCookieKey,
					JSON.stringify({ id: attendeeId, email, name: guestDetails?.name }),
				);
			}

			return status;
		},
		onSuccess: (status) => {
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
