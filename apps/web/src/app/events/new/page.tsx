import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Typography, Card, Flex, Container } from '@noria/ui';
import { EventForm } from './event-form';

const NewEventPage = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login');
	}

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
