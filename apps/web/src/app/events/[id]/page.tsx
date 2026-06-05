import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button, Typography, Flex, Container, Link, Card } from '@noria/ui';
import { formatFullDateTime } from '@/utils/date';

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login');
	}

	const { data: event, error } = await supabase
		.from('events')
		.select('*')
		.eq('id', params.id)
		.single();

	if (error || !event) {
		return (
			<Flex as="main" justify="center" align="center" grow>
				<Flex direction="column" align="center" textAlign="center">
					<Typography variant="h1">Event not found</Typography>
					<Typography variant="body" color="muted" mt="xs">
						The event you are looking for does not exist.
					</Typography>
					<Link href="/" mt="sm" inlineBlock>
						<Button>Go back</Button>
					</Link>
				</Flex>
			</Flex>
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
				<Typography variant="h1">{event.title}</Typography>
				<Typography variant="body" color="muted" mt="xs">
					{formatFullDateTime(event.start_datetime)}
				</Typography>
				<Flex mt="lg">
					<Card p="md" fullWidth>
						<Typography variant="body">
							This is a placeholder for the event details page.
						</Typography>
						<Typography variant="body-small" mt="sm">
							Location: {event.location}
						</Typography>
					</Card>
				</Flex>
			</Container>
		</main>
	);
};

export default EventDetailsPage;
