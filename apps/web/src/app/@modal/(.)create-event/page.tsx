'use client';

import { InterceptedModal } from '@/components';
import { Dialog, Typography, Flex } from '@noria/ui';
import { EventForm } from '@/components/event-form/event-form';

const CreateEventModal = () => {
	return (
		<InterceptedModal>
			<Dialog aria-label="Create New Event">
				<Flex direction="column" gap="md" p="lg">
					<Typography variant="h1">Create New Event</Typography>
					<EventForm />
				</Flex>
			</Dialog>
		</InterceptedModal>
	);
};

export default CreateEventModal;
