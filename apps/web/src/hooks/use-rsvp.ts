import { useTransition } from 'react';
import { upsertRsvp } from '@/actions/rsvp';
import { RsvpStatus } from '@noria/schemas';
import { toastQueue } from '@noria/ui';

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
	const [isPending, startTransition] = useTransition();

	const handleRSVP = (status: RsvpStatus) => {
		startTransition(async () => {
			try {
				await upsertRsvp(eventId, status);
				const message = TOAST_MESSAGES[status];

				toastQueue.add(
					{
						title: message.title,
						description: message.description,
						type: 'success',
					},
					{ timeout: 5000 },
				);
			} catch {
				toastQueue.add(
					{
						title: 'Oops!',
						description: 'We hit a snag saving your response. Give it another try!',
						type: 'danger',
					},
					{ timeout: 5000 },
				);
			}
		});
	};

	return {
		isPending,
		handleRSVP,
	};
};
