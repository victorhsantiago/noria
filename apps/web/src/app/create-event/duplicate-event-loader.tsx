'use client';

import { EventForm } from '@/components/event-form/event-form';
import { useEventById } from '@/hooks/use-events';
import { EventWithRSVPs } from '@/hooks/use-dashboard';

interface DuplicateEventLoaderProps {
	id: string;
	onSuccess?: () => void;
}

export const DuplicateEventLoader = ({ id, onSuccess }: DuplicateEventLoaderProps) => {
	const { data } = useEventById(id);

	let initialData: EventWithRSVPs | undefined = undefined;

	if (data) {
		initialData = { ...data };
		const originalDate = new Date(initialData.start_datetime);
		const now = new Date();
		originalDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
		initialData.start_datetime = originalDate.toISOString();
		initialData.goingCount = 0;
		initialData.maybeCount = 0;
		initialData.notGoingCount = 0;
	}

	return <EventForm initialData={initialData} mode="create" onSuccess={onSuccess} />;
};
