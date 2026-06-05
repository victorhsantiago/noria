"use server";

import { createClient } from "@/utils/supabase/server";

export type EventWithRSVPs = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_datetime: string;
  duration: string | null;
  frequency: string | null;
  organizer_id: string;
  attendees: { rsvp_status: "Going" | "Maybe" | "Not Going" }[];
  goingCount: number;
  maybeCount: number;
  notGoingCount: number;
};

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: events, error } = await supabase
    .from("events")
    .select(`
      *,
      attendees (
        rsvp_status
      )
    `)
    .eq("organizer_id", user.id)
    .order("start_datetime", { ascending: true });

  if (error || !events) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }

  const processedEvents: EventWithRSVPs[] = events.map(event => {
    const attendees = (event.attendees || []);
    return {
      ...event,
      attendees,
      goingCount: attendees.filter(a => a.rsvp_status === "Going").length,
      maybeCount: attendees.filter(a => a.rsvp_status === "Maybe").length,
      notGoingCount: attendees.filter(a => a.rsvp_status === "Not Going").length,
    };
  });

  const now = new Date().toISOString();

  // Filter and sort
  const allUpcoming = processedEvents.filter(e => e.start_datetime >= now);
  // Past events should probably be sorted descending (most recent past first)
  const pastEventsRaw = processedEvents.filter(e => e.start_datetime < now);
  const pastEvents = [...pastEventsRaw].sort((a, b) => b.start_datetime.localeCompare(a.start_datetime)).slice(0, 3);
  const hasMorePastEvents = pastEventsRaw.length > 3;

  const nextEvent = allUpcoming.length > 0 ? allUpcoming[0] : null;
  const upcomingEvents = allUpcoming.slice(1, 4);
  const hasMoreUpcomingEvents = allUpcoming.length > 4;

  return {
    user,
    nextEvent,
    upcomingEvents,
    hasMoreUpcomingEvents,
    pastEvents,
    hasMorePastEvents,
  };
}
