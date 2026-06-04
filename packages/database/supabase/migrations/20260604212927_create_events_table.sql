CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  duration TEXT,
  frequency TEXT NOT NULL,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Organizers can Create, Read, Update, and Delete their own events
CREATE POLICY "Organizers can manage their own events" ON events
  FOR ALL
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

-- Guests can Read an event (public read access)
CREATE POLICY "Public can read events" ON events
  FOR SELECT
  TO public
  USING (true);
