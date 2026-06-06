import { redirect } from 'next/navigation';
import { Button, Typography, Flex, Container, Link } from '@noria/ui';
import { CreateEventButton, EventCard } from '@/components';
import { getDashboardData } from '@/actions/dashboard';
import { logout } from '@/actions/auth';

const HomePage = async () => {
	const data = await getDashboardData();

	if (!data) {
		redirect('/login');
	}

	const { user, nextEvent, upcomingEvents, hasMoreUpcomingEvents, pastEvents, hasMorePastEvents } =
		data;

	return (
		<main>
			<Container maxWidth="800px" padding="lg">
				{/* Header section */}
				<Flex as="header" justify="space-between" align="center" wrap gap="sm" mb="lg">
					<Flex direction="column">
						<Typography variant="h1">Noria</Typography>
						<Typography variant="body" color="muted">
							Welcome back 👋 <strong>{user.email}</strong>
						</Typography>
					</Flex>
					<Flex gap="sm" align="center">
						<form action={logout}>
							<Button type="submit" variant="secondary">
								Log Out
							</Button>
						</form>
						<Link href="/design">
							<Button variant="secondary">UI Tokens</Button>
						</Link>
						<Flex maxWidth="150px">
							<CreateEventButton />
						</Flex>
					</Flex>
				</Flex>

				{/* Dashboard Content */}
				<Flex direction="column" gap="xl">
					{/* Next Event Section */}
					<Flex as="section" direction="column">
						<Typography variant="h2-caps" mb="sm">
							Next Event
						</Typography>
						{nextEvent ? (
							<EventCard event={nextEvent} highlight={true} />
						) : (
							<Typography variant="body" color="muted">
								You have no upcoming events.
							</Typography>
						)}
					</Flex>

					{/* Upcoming Events Section */}
					<Flex as="section" direction="column">
						<Typography variant="h2-caps" mb="sm">
							Upcoming
						</Typography>
						{upcomingEvents.length > 0 ? (
							<Flex direction="column" gap="sm">
								{upcomingEvents.map((event) => (
									<EventCard key={event.id} event={event} />
								))}
								{hasMoreUpcomingEvents && (
									<Flex alignSelf="start">
										<Button variant="secondary">See All</Button>
									</Flex>
								)}
							</Flex>
						) : (
							<Typography variant="body" color="muted">
								No other upcoming events.
							</Typography>
						)}
					</Flex>

					{/* Past Events Section */}
					<Flex as="section" direction="column">
						<Typography variant="h2-caps" mb="sm">
							Past
						</Typography>
						{pastEvents.length > 0 ? (
							<Flex direction="column" gap="sm">
								{pastEvents.map((event) => (
									<EventCard key={event.id} event={event} />
								))}
								{hasMorePastEvents && (
									<Flex alignSelf="start">
										<Button variant="secondary">See History</Button>
									</Flex>
								)}
							</Flex>
						) : (
							<Typography variant="body" color="muted">
								No past events.
							</Typography>
						)}
					</Flex>
				</Flex>
			</Container>
		</main>
	);
};

export default HomePage;
