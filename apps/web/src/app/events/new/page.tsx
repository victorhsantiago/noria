import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EventForm } from "./event-form";
import { Card } from "@noria/ui";

const NewEventPage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '2rem 1rem' }}>
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Create New Event</h1>
        <EventForm />
      </Card>
    </div>
  );
}

export default NewEventPage;
