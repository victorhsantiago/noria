import { getEventById } from '@/actions/events';
import { InterceptedModal, EventDetails } from '@/components';
import { Dialog } from '@noria/ui';

const EventModal = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const eventWithRSVPs = await getEventById(id);

	if (!eventWithRSVPs) {
		return null;
	}

	return (
		<InterceptedModal>
			<Dialog aria-label={eventWithRSVPs.title}>
				<EventDetails event={eventWithRSVPs} />
			</Dialog>
		</InterceptedModal>
	);
};

export default EventModal;
