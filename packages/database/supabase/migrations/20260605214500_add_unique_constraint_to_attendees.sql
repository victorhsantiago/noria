ALTER TABLE "public"."attendees" 
ADD CONSTRAINT "attendees_event_id_user_id_key" UNIQUE ("event_id", "user_id");
