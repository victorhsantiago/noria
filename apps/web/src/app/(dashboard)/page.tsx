'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button, Typography, Flex, Container, Link } from '@noria/ui';
import { CreateEventButton, EventList } from '@/components';
import { useUser, useLogout } from '@/hooks/use-auth';

const HomePage = () => {
	const { data: user, isPending: isUserPending } = useUser();
	const { mutate: logoutMutation } = useLogout();
	const router = useRouter();

	useEffect(() => {
		if (!isUserPending && !user) {
			router.push('/login');
		}
	}, [isUserPending, user, router]);

	if (!isUserPending && !user) {
		return null;
	}

	return (
		<main>
			<Container maxWidth="800px" padding="lg">
				{/* Header section */}
				<Flex as="header" justify="space-between" align="center" wrap gap="sm" mb="lg">
					<Flex direction="column">
						<Typography variant="h1">Noria</Typography>
						<Typography variant="body" color="muted">
							Welcome back 👋 <strong>{user?.email || '...'}</strong>
						</Typography>
					</Flex>
					<Flex gap="sm" align="center">
						<Button variant="secondary" onClick={() => logoutMutation()}>
							Log Out
						</Button>
						<Link href="/design">
							<Button variant="secondary">UI Tokens</Button>
						</Link>
						<Flex maxWidth="150px">
							<CreateEventButton />
						</Flex>
					</Flex>
				</Flex>

				{/* Dashboard Content */}
				<EventList userId={user?.id} />
			</Container>
		</main>
	);
};

export default HomePage;
