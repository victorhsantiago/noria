import { Container, Typography, Link } from '@noria/ui';
import { EventDetailsSkeleton } from '@/components';

const Loading = () => {
	return (
		<main>
			<Container maxWidth="800px" padding="lg">
				<Typography color="primary" mb="lg">
					<Link href="/" inlineBlock>
						← Back to Dashboard
					</Link>
				</Typography>
				<EventDetailsSkeleton />
			</Container>
		</main>
	);
};

export default Loading;
