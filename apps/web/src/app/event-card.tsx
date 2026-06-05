"use client";

import { Card, Badge, Typography, Flex } from "@noria/ui";
import { useRouter } from "next/navigation";
import { EventWithRSVPs } from "./dashboard-actions";

export const EventCard = ({ event, highlight = false }: { event: EventWithRSVPs, highlight?: boolean }) => {
  const router = useRouter();

  return (
    <Card
      interactive
      onClick={() => router.push(`/events/${event.id}`)}
      p="md"
    >
      <Flex direction="column" gap="sm">
        <Flex justify="space-between" align="start">
          <Typography variant="h3">
            {event.title}
          </Typography>
        </Flex>
        
        <Flex direction="column" gap="xs">
          <Typography variant="body-small" suppressHydrationWarning>
            {new Date(event.start_datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            {highlight && ` · ${event.location}`}
          </Typography>

          {highlight && (
            <Flex gap="xs" wrap>
              {<Badge variant="success">{event.goingCount} Going</Badge>}
              {<Badge variant="warning">{event.maybeCount} Maybe</Badge>}
              {<Badge variant="danger">{event.notGoingCount} Not Going</Badge>}
              {event.goingCount === 0 && event.maybeCount === 0 && event.notGoingCount === 0 && (
                <Badge variant="default">0 RSVPs</Badge>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
