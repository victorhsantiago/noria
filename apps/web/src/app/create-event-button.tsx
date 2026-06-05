"use client";

import { Button } from "@noria/ui";
import { useRouter } from "next/navigation";

export const CreateEventButton = () => {
  const router = useRouter();
  return (
    <Button variant="primary" style={{ width: '100%' }} onPress={() => router.push('/events/new')}>
      Create New Event
    </Button>
  );
}
