'use client';

import { useEventById } from '@/hooks/use-events';
import { InterceptedModal, EventDetails } from '@/components';
import { Dialog, Typography } from '@noria/ui';
import { use } from 'react';

const EventModal = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params);
	const { data: eventWithRSVPs } = useEventById(id);

	if (!eventWithRSVPs) {
		return (
			<InterceptedModal>
				<Dialog aria-label="Event not found">
					<Typography variant="body">Event not found.</Typography>
				</Dialog>
			</InterceptedModal>
		);
	}

	return (
		<InterceptedModal>
			<Dialog aria-label={eventWithRSVPs.title}>
				<EventDetails event={eventWithRSVPs} />
			</Dialog>
		</InterceptedModal>
	);
};

export default EventModal;
