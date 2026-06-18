'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Typography, Flex, Container } from '@noria/ui';
import { Topbar, EventList } from '@/components';
import { useUser } from '@/hooks/use-auth';

const HomePage = () => {
	const { data: user, isPending: isUserPending } = useUser();
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
		<>
			<Topbar />
			<main>
				<Container maxWidth="800px" padding="lg">
					{/* Welcome Section */}
					<Flex direction="column" mb="lg">
						<Typography variant="h1">Dashboard</Typography>
						<Typography variant="body" color="muted" mt="xs">
							Welcome back 👋 <strong>{user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || '...'}</strong>
						</Typography>
					</Flex>

					{/* Dashboard Content */}
					<EventList userId={user?.id} />
				</Container>
			</main>
		</>
	);
};

export default HomePage;

