import { Flex, Container, Typography, Skeleton } from '@noria/ui';
import { EventCardSkeleton } from '@/components';

const Loading = () => {
	return (
		<main>
			<Container maxWidth="800px" padding="lg">
				{/* Header section skeleton */}
				<Flex as="header" justify="space-between" align="center" wrap gap="sm" mb="lg">
					<Flex direction="column" gap="xs">
						<Skeleton width="100px" height="32px" />
						<Skeleton width="200px" height="20px" />
					</Flex>
					<Flex gap="sm" align="center">
						<Skeleton width="80px" height="40px" borderRadius="8px" />
						<Skeleton width="100px" height="40px" borderRadius="8px" />
						<Skeleton width="120px" height="40px" borderRadius="8px" />
					</Flex>
				</Flex>

				{/* Dashboard Content skeleton */}
				<Flex direction="column" gap="xl">
					<Flex as="section" direction="column">
						<Typography variant="h2-caps" mb="sm">
							Next Event
						</Typography>
						<EventCardSkeleton />
					</Flex>

					<Flex as="section" direction="column">
						<Typography variant="h2-caps" mb="sm">
							Upcoming
						</Typography>
						<Flex direction="column" gap="sm">
							<EventCardSkeleton />
							<EventCardSkeleton />
						</Flex>
					</Flex>

					<Flex as="section" direction="column">
						<Typography variant="h2-caps" mb="sm">
							Past
						</Typography>
						<Flex direction="column" gap="sm">
							<EventCardSkeleton />
						</Flex>
					</Flex>
				</Flex>
			</Container>
		</main>
	);
};

export default Loading;
