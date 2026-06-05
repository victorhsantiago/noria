import { createClient } from '@/utils/supabase/server';

import { Container, Link, Typography } from '@noria/ui';
import { EventDetails } from '@/components';

const EventDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const supabase = await createClient();

	const { data: event, error } = await supabase
		.from('events')
		.select(
			`
      *,
      attendees (
        rsvp_status
      )
    `,
		)
		.eq('id', id)
		.single();

	if (error || !event) {
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

	const attendees = event.attendees || [];
	const eventWithRSVPs = {
		...event,
		attendees,
		goingCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Going').length,
		maybeCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Maybe').length,
		notGoingCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Not Going').length,
	};

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
