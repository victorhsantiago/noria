'use client';

import { useEventById } from '@/hooks/use-events';
import { use } from 'react';

import { Container, Link, Typography } from '@noria/ui';
import { EventDetails } from '@/components';

const EventDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
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
			<Container maxWidth="800px" padding="lg">
				<Typography color="primary" mb="lg">
					<Link href="/" inlineBlock>
						← Back to Dashboard
					</Link>
				</Typography>
				<EventDetails event={eventWithRSVPs} />
			</Container>
		</main>
	);
};

export default EventDetailsPage;
