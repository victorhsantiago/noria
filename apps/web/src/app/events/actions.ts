"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  start_datetime: z.string(),
  duration: z.string().min(1, "Duration is required"),
  frequency: z.string().min(1, "Frequency is required"),
});

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    start_datetime: formData.get("start_datetime") as string,
    duration: formData.get("duration") as string,
    frequency: formData.get("frequency") as string,
  };

  const parsed = eventSchema.parse(rawData);

  const { error } = await supabase.from("events").insert({
    title: parsed.title,
    description: parsed.description || null,
    location: parsed.location,
    start_datetime: parsed.start_datetime,
    duration: parsed.duration,
    frequency: parsed.frequency,
    organizer_id: user.id,
  }).select().single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/`);
}
