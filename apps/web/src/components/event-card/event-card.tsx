'use client';

import { Card, Badge, Typography, Flex, Skeleton, Link } from '@noria/ui';

import { EventWithRSVPs } from '@/hooks/use-dashboard';
import { formatEventDate } from '@/utils/date';

export const EventCard = ({
	event,
	highlight = false,
}: {
	event: EventWithRSVPs;
	highlight?: boolean;
}) => {
	return (
		<Link href={`/events/${event.id}`}>
			<Card interactive p="md">
				<Flex direction="column" gap="sm">
					<Flex justify="space-between" align="start">
						<Typography variant="h3">{event.title}</Typography>
					</Flex>

					<Flex direction="column" gap="xs">
						<Typography variant="body-small" suppressHydrationWarning>
							{formatEventDate(event.start_datetime)}
							{highlight && ` · ${event.location}`}
						</Typography>

						{highlight && (
							<Flex gap="xs" wrap>
								{event.goingCount > 0 && <Badge variant="success">{event.goingCount} Going</Badge>}
								{event.maybeCount > 0 && <Badge variant="warning">{event.maybeCount} Maybe</Badge>}
								{event.notGoingCount > 0 && (
									<Badge variant="danger">{event.notGoingCount} Not Going</Badge>
								)}
								{event.goingCount === 0 && event.maybeCount === 0 && event.notGoingCount === 0 && (
									<Badge variant="info">No one yet</Badge>
								)}
							</Flex>
						)}
					</Flex>
				</Flex>
			</Card>
		</Link>
	);
};

export const EventCardSkeleton = () => {
	return (
		<Card p="md">
			<Flex direction="column" gap="sm">
				<Flex justify="space-between" align="start">
					<Skeleton width="60%" height="24px" />
				</Flex>

				<Flex direction="column" gap="xs">
					<Skeleton width="40%" height="16px" mt="xs" />
					<Flex gap="xs" wrap mt="sm">
						<Skeleton width="60px" height="24px" borderRadius="12px" />
						<Skeleton width="80px" height="24px" borderRadius="12px" />
					</Flex>
				</Flex>
			</Flex>
		</Card>
	);
};
