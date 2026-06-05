"use client";

import { Card, Badge, Typography, Flex } from "@noria/ui";
import { useRouter } from "next/navigation";
import { EventWithRSVPs } from "@/actions/dashboard";
import { formatEventDate } from "@/utils/date";

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
            {formatEventDate(event.start_datetime)}
            {highlight && ` · ${event.location}`}
          </Typography>

          {highlight && (
            <Flex gap="xs" wrap>
              {event.goingCount > 0 && <Badge variant="success">{event.goingCount} Going</Badge>}
              {event.maybeCount > 0 && <Badge variant="warning">{event.maybeCount} Maybe</Badge>}
              {event.notGoingCount > 0 && <Badge variant="danger">{event.notGoingCount} Not Going</Badge>}
              {event.goingCount === 0 && event.maybeCount === 0 && event.notGoingCount === 0 && (
                <Badge variant="info">No one yet</Badge>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
