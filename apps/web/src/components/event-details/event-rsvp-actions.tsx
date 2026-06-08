'use client';

import { useState } from 'react';
import { Button, Flex } from '@noria/ui';
import { useUser } from '@/hooks/use-auth';
import { useRsvp } from '@/hooks/use-rsvp';
import { GuestRsvpModal, GuestRsvpFormValues } from './guest-rsvp-modal';
import { RsvpStatus } from '@noria/schemas';
import { EventWithRSVPs } from '@/hooks/use-dashboard';

export const EventRsvpActions = ({ event }: { event: EventWithRSVPs }) => {
	const { data: user } = useUser();
	const { isPending, handleRSVP } = useRsvp(event.id);

	const [guestModalOpen, setGuestModalOpen] = useState(false);
	const [selectedRsvp, setSelectedRsvp] = useState<RsvpStatus>('Going');
	const [guestDefaults, setGuestDefaults] = useState<{ email?: string; name?: string }>(() => {
		if (typeof window !== 'undefined') {
			const guestCookieKey = `noria_guest_rsvp_${event.id}`;
			const raw = localStorage.getItem(guestCookieKey);
			if (raw) {
				try {
					const parsed = JSON.parse(raw);
					return { email: parsed.email, name: parsed.name };
				} catch {
					return {};
				}
			}
		}
		return {};
	});

	const onRsvpClick = (status: RsvpStatus) => {
		if (user) {
			handleRSVP({ status });
		} else {
			setSelectedRsvp(status);
			setGuestModalOpen(true);
		}
	};

	const onGuestRsvpSubmit = (data: GuestRsvpFormValues) => {
		handleRSVP(
			{ status: selectedRsvp, guestDetails: data },
			{
				onSuccess: () => {
					setGuestModalOpen(false);
					setGuestDefaults({ email: data.email, name: data.name });
				},
			},
		);
	};

	const handleRsvpGoing = () => onRsvpClick('Going');
	const handleRsvpMaybe = () => onRsvpClick('Maybe');
	const handleRsvpNotGoing = () => onRsvpClick('Not Going');

	return (
		<>
			<Flex gap="sm" justify="space-between">
				<Button fullWidth variant="primary" onPress={handleRsvpGoing} isDisabled={isPending}>
					Going
				</Button>
				<Button fullWidth variant="secondary" onPress={handleRsvpMaybe} isDisabled={isPending}>
					Maybe
				</Button>
				<Button fullWidth variant="danger" onPress={handleRsvpNotGoing} isDisabled={isPending}>
					Can&apos;t Make It
				</Button>
			</Flex>

			<GuestRsvpModal
				isOpen={guestModalOpen}
				onOpenChange={setGuestModalOpen}
				onSubmit={onGuestRsvpSubmit}
				status={selectedRsvp}
				isPending={isPending}
				defaultValues={guestDefaults}
			/>
		</>
	);
};
