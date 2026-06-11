-- Create a function to check if the event is in the past
CREATE OR REPLACE FUNCTION check_event_not_past()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM events
    WHERE id = NEW.event_id AND start_datetime < NOW()
  ) THEN
    RAISE EXCEPTION 'Cannot RSVP to or update responses for past events.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on attendees to run the check function before insert or update
CREATE TRIGGER enforce_event_not_past
BEFORE INSERT OR UPDATE ON attendees
FOR EACH ROW
EXECUTE FUNCTION check_event_not_past();
