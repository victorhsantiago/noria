-- Allow public to read attendees
CREATE POLICY "Public can read attendees" ON attendees
  FOR SELECT
  USING (true);
