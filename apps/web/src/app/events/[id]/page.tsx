import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button, Typography, Flex, Container } from "@noria/ui";
import Link from "next/link";

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !event) {
    return (
      <Flex as="main" justify="center" align="center" style={{ flex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h1">Event not found</Typography>
          <Typography variant="body" color="muted" style={{ marginTop: '0.5rem' }}>The event you are looking for does not exist.</Typography>
          <Link href="/" style={{ marginTop: '1rem', display: 'inline-block' }}>
            <Button>Go back</Button>
          </Link>
        </div>
      </Flex>
    );
  }

  return (
    <main>
      <Container maxWidth="800px" padding="lg">
        <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--primary)' }}>
          ← Back to Dashboard
        </Link>
        <Typography variant="h1">{event.title}</Typography>
        <Typography variant="body" color="muted" style={{ marginTop: '0.5rem' }}>{new Date(event.start_datetime).toLocaleString()}</Typography>
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface)', borderRadius: '1rem' }}>
          <Typography variant="body">This is a placeholder for the event details page.</Typography>
          <Typography variant="body-small" style={{ marginTop: '1rem' }}>Location: {event.location}</Typography>
        </div>
      </Container>
    </main>
  );
};

export default EventDetailsPage;
