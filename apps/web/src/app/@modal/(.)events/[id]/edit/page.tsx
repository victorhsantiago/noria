'use client';

import { useEventById } from '@/hooks/use-events';
import { use } from 'react';
import { InterceptedModal } from '@/components';
import { Dialog, Typography, Flex } from '@noria/ui';
import { EventForm } from '@/components/event-form/event-form';
import { useRouter } from 'next/navigation';

const EditEventModal = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params);
	const { data: eventWithRSVPs } = useEventById(id);
	const router = useRouter();

	if (!eventWithRSVPs) {
		return null;
	}

	return (
		<InterceptedModal>
			<Dialog aria-label="Edit Event">
				<Flex direction="column" gap="md" p="lg">
					<Typography variant="h1">Edit Event</Typography>
					<EventForm
						mode="edit"
						initialData={eventWithRSVPs}
						onSuccess={() => {
							router.back();
						}}
					/>
				</Flex>
			</Dialog>
		</InterceptedModal>
	);
};

export default EditEventModal;
