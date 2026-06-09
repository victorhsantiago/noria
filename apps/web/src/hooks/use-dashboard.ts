import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { RsvpStatus } from '@noria/schemas';

export type EventWithRSVPs = {
	id: string;
	title: string;
	description: string | null;
	location: string;
	start_datetime: string;
	duration: string | null;
	frequency: string | null;
	organizer_id: string;
	attendees: {
		id?: string;
		guest_name?: string;
		email?: string | null;
		rsvp_status: RsvpStatus;
		user_id?: string | null;
		created_at?: string | null;
	}[];
	goingCount: number;
	maybeCount: number;
	notGoingCount: number;
};

export const useDashboardData = (userId: string | undefined) => {
	return useQuery({
		queryKey: ['dashboard', userId],
		enabled: !!userId,
		queryFn: async () => {
			const supabase = createClient();

			if (!userId) return null;

			const { data: events, error } = await supabase
				.from('events')
				.select(
					`
			  *,
			  attendees (
				rsvp_status
			  )
			`,
				)
				.eq('organizer_id', userId)
				.order('start_datetime', { ascending: true });

			if (error || !events) {
				console.error('Error fetching dashboard data:', error);
				return null;
			}

			const processedEvents: EventWithRSVPs[] = events.map((event) => {
				const attendees = event.attendees || [];
				return {
					...event,
					attendees,
					goingCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Going')
						.length,
					maybeCount: attendees.filter((a: { rsvp_status: string }) => a.rsvp_status === 'Maybe')
						.length,
					notGoingCount: attendees.filter(
						(a: { rsvp_status: string }) => a.rsvp_status === 'Not Going',
					).length,
				};
			});

			const now = new Date().toISOString();

			const allUpcoming = processedEvents.filter((e) => e.start_datetime >= now);
			const pastEventsRaw = processedEvents.filter((e) => e.start_datetime < now);
			const pastEvents = [...pastEventsRaw]
				.sort((a, b) => b.start_datetime.localeCompare(a.start_datetime))
				.slice(0, 3);
			const hasMorePastEvents = pastEventsRaw.length > 3;

			const nextEvent = allUpcoming.length > 0 ? allUpcoming[0] : null;
			const upcomingEvents = allUpcoming.slice(1, 4);
			const hasMoreUpcomingEvents = allUpcoming.length > 4;

			return {
				nextEvent,
				upcomingEvents,
				hasMoreUpcomingEvents,
				pastEvents,
				hasMorePastEvents,
			};
		},
	});
};
