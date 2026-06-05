CREATE TYPE rsvp_status_enum AS ENUM ('Going', 'Maybe', 'Not Going');

CREATE TABLE attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status rsvp_status_enum NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for foreign keys
CREATE INDEX attendees_event_id_idx ON attendees(event_id);
CREATE INDEX attendees_user_id_idx ON attendees(user_id);

-- Partial unique indexes to prevent duplicate RSVPs
CREATE UNIQUE INDEX unique_event_user ON attendees(event_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX unique_event_email ON attendees(event_id, email) WHERE email IS NOT NULL;

-- Enable RLS
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Anyone can insert" ON attendees 
  FOR INSERT 
  WITH CHECK (true);

-- Anyone can update
CREATE POLICY "Anyone can update" ON attendees 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

-- Organizers can read attendees for their events
CREATE POLICY "Organizers can read attendees" ON attendees 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = attendees.event_id 
      AND events.organizer_id = auth.uid()
    )
  );
