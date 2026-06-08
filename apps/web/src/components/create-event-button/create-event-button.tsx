'use client';

import { Button } from '@noria/ui';
import { useRouter } from 'next/navigation';
import { CirclePlus } from 'lucide-react';

export const CreateEventButton = () => {
	const router = useRouter();
	return (
		<Button
			variant="primary"
			fullWidth
			icon={CirclePlus}
			onPress={() => router.push('/create-event')}
		>
			New Event
		</Button>
	);
};
