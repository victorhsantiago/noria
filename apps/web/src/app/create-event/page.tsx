import { requireUser } from '@/actions/auth';
import { Typography, Card, Flex, Container } from '@noria/ui';
import { EventForm } from './event-form';

const NewEventPage = async () => {
	await requireUser();

	return (
		<Container maxWidth="42rem" padding="lg">
			<Card p="md">
				<Flex direction="column" gap="md">
					<Typography variant="h1">Create New Event</Typography>
					<EventForm />
				</Flex>
			</Card>
		</Container>
	);
};

export default NewEventPage;
