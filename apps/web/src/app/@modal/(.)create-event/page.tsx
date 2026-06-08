'use client';

import { InterceptedModal } from '@/components';
import { Dialog, Typography, Flex } from '@noria/ui';
import { EventForm } from '@/components/event-form/event-form';
import { DuplicateEventLoader } from '@/app/create-event/duplicate-event-loader';
import { use } from 'react';

const CreateEventModal = (props: { searchParams: Promise<{ duplicateId?: string }> }) => {
	const searchParams = use(props.searchParams);

	return (
		<InterceptedModal>
			<Dialog aria-label="Create New Event">
				<Flex direction="column" gap="md" p="lg">
					<Typography variant="h1">Create New Event</Typography>
					{searchParams?.duplicateId ? (
						<DuplicateEventLoader id={searchParams.duplicateId} />
					) : (
						<EventForm mode="create" />
					)}
				</Flex>
			</Dialog>
		</InterceptedModal>
	);
};

export default CreateEventModal;
