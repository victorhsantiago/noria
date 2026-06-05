import { createClient } from '@/utils/supabase/server';
import { InterceptedModal, EventDetails } from '@/components';
import { Dialog } from '@noria/ui';

const EventModal = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	const { data: event, error } = await supabase
		.from('events')
		.select(
			`
      *,
      attendees (
        rsvp_status
      )
    `,
		)
		.eq('id', id)
		.single();

	if (error || !event) {
		return null;
	}

	const attendees = event.attendees || [];
	const eventWithRSVPs = {
		...event,
		attendees,
		goingCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Going').length,
		maybeCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Maybe').length,
		notGoingCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Not Going').length,
	};

	return (
		<InterceptedModal>
			<Dialog aria-label={eventWithRSVPs.title}>
				<EventDetails event={eventWithRSVPs} />
			</Dialog>
		</InterceptedModal>
	);
};

export default EventModal;
