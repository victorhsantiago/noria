ALTER TABLE events
  ADD CONSTRAINT check_title_length CHECK (char_length(title) <= 100),
  ADD CONSTRAINT check_location_length CHECK (char_length(location) <= 150);
