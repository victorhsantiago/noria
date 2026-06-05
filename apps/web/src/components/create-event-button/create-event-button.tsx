'use client';

import { Button } from '@noria/ui';
import { useRouter } from 'next/navigation';

export const CreateEventButton = () => {
	const router = useRouter();
	return (
		<Button variant="primary" fullWidth onPress={() => router.push('/events/new')}>
			Create New Event
		</Button>
	);
};
