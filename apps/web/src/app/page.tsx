import { redirect } from 'next/navigation'
import { Button, Typography, Flex, Container } from '@noria/ui'
import { CreateEventButton } from './create-event-button'
import { getDashboardData } from './dashboard-actions'
import { EventCard } from './event-card'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

const HomePage = async () => {
  const data = await getDashboardData();

  if (!data) {
    redirect('/login');
  }

  const { user, nextEvent, upcomingEvents, pastEvents } = data;

  const signOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main>
      <Container maxWidth="800px" padding="lg">
        
        {/* Header section */}
        <Flex as="header" justify="space-between" align="center" wrap gap="sm" style={{ marginBottom: '2rem' }}>
          <div>
            <Typography variant="h1">
              Noria
            </Typography>
            <Typography variant="body" color="muted">
              Welcome back 👋 <strong>{user.email}</strong>
            </Typography>
          </div>
          <Flex gap="sm" align="center">
            <form action={signOut}>
              <Button type="submit" variant="secondary">Log Out</Button>
            </form>
            <Link href="/design">
              <Button variant="secondary">UI Tokens</Button>
            </Link>
            <div style={{ width: '150px' }}>
              <CreateEventButton />
            </div>
          </Flex>
        </Flex>

        {/* Dashboard Content */}
        <Flex direction="column" gap="xl">
          
          {/* Next Event Section */}
          <section>
            <Typography variant="h2-caps" style={{ marginBottom: '1rem' }}>
              Next Event
            </Typography>
            {nextEvent ? (
              <EventCard event={nextEvent} highlight={true} />
            ) : (
              <Typography variant="body" color="muted">You have no upcoming events.</Typography>
            )}
          </section>

          {/* Upcoming Events Section */}
          <section>
            <Typography variant="h2-caps" style={{ marginBottom: '1rem' }}>
              Upcoming Events
            </Typography>
            {upcomingEvents.length > 0 ? (
              <Flex direction="column" gap="sm">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
                <div style={{ alignSelf: 'flex-start' }}>
                  <Button variant="secondary">See All</Button>
                </div>
              </Flex>
            ) : (
              <Typography variant="body" color="muted">No other upcoming events.</Typography>
            )}
          </section>

          {/* Past Events Section */}
          <section>
            <Typography variant="h2-caps" style={{ marginBottom: '1rem' }}>
              Past Events
            </Typography>
            {pastEvents.length > 0 ? (
              <Flex direction="column" gap="sm">
                {pastEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
                <div style={{ alignSelf: 'flex-start' }}>
                  <Button variant="secondary">See History</Button>
                </div>
              </Flex>
            ) : (
              <Typography variant="body" color="muted">No past events.</Typography>
            )}
          </section>

        </Flex>
      </Container>
    </main>
  )
}

export default HomePage;
