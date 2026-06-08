'use client';

import { Typography, Card, Flex, Container } from '@noria/ui';
import { EventForm } from '@/components/event-form/event-form';
import { DuplicateEventLoader } from './duplicate-event-loader';
import { useUser } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

const NewEventPage = (props: { searchParams: Promise<{ duplicateId?: string }> }) => {
	const searchParams = use(props.searchParams);
	const { data: user, isPending } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!isPending && !user) {
			router.push('/login');
		}
	}, [user, isPending, router]);

	if (isPending || !user) {
		return null;
	}

	return (
		<Container maxWidth="42rem" padding="lg">
			<Card p="md">
				<Flex direction="column" gap="md">
					<Typography variant="h1">Create New Event</Typography>
					{searchParams?.duplicateId ? (
						<DuplicateEventLoader id={searchParams.duplicateId} />
					) : (
						<EventForm mode="create" />
					)}
				</Flex>
			</Card>
		</Container>
	);
};

export default NewEventPage;
