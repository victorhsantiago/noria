ALTER TABLE events
ADD COLUMN parent_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
ADD COLUMN recurrence_group_id UUID;

CREATE INDEX events_recurrence_group_id_idx ON events(recurrence_group_id);
CREATE INDEX events_parent_event_id_idx ON events(parent_event_id);
