import { InterceptedModal, EventDetailsSkeleton } from '@/components';
import { Dialog } from '@noria/ui';

const Loading = () => {
	return (
		<InterceptedModal>
			<Dialog aria-label="Loading event details">
				<EventDetailsSkeleton />
			</Dialog>
		</InterceptedModal>
	);
};

export default Loading;
