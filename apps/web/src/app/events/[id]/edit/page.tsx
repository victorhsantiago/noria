'use client';

import { useEventById } from '@/hooks/use-events';
import { use } from 'react';
import { Container, Link, Typography, Flex } from '@noria/ui';
import { EventForm } from '@/components/event-form/event-form';

const EditEventPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params);
	const { data: eventWithRSVPs } = useEventById(id);

	if (!eventWithRSVPs) {
		return (
			<main>
				<Container maxWidth="800px" padding="lg">
					<Typography variant="h1">Event not found</Typography>
					<Typography variant="body" color="muted" mt="xs">
						The event you are looking for does not exist.
					</Typography>
					<Link href="/" mt="sm" inlineBlock>
						← Go back
					</Link>
				</Container>
			</main>
		);
	}

	return (
		<main>
			<Container maxWidth="42rem" padding="lg">
				<Typography color="primary" mb="lg">
					<Link href={`/events/${id}`} inlineBlock>
						← Back to Event
					</Link>
				</Typography>
				<Flex direction="column" gap="md">
					<Typography variant="h1">Edit Event</Typography>
					<EventForm mode="edit" initialData={eventWithRSVPs} />
				</Flex>
			</Container>
		</main>
	);
};

export default EditEventPage;
