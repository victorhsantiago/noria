ALTER TABLE events
  ADD CONSTRAINT check_description_length
  CHECK (char_length(description) <= 500);
