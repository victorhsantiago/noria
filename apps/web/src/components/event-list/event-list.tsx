'use client';

import { Flex, Typography, Button, Skeleton } from '@noria/ui';
import { EventCard } from '@/components';
import { useDashboardData } from '@/hooks/use-dashboard';

export const EventList = ({ userId }: { userId: string | undefined }) => {
	const { data, isPending } = useDashboardData(userId);

	if (isPending) {
		return (
			<Flex direction="column" gap="xl">
				<Skeleton width="100%" height="150px" borderRadius="12px" />
				<Skeleton width="100%" height="150px" borderRadius="12px" />
			</Flex>
		);
	}

	if (!data) return null;

	const { nextEvent, upcomingEvents, hasMoreUpcomingEvents, pastEvents, hasMorePastEvents } = data;

	return (
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
	);
};
