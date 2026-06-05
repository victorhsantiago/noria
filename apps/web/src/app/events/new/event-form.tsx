"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Select, SelectItem, TimeField, DatePicker } from "@noria/ui";
import { createEvent } from "../actions";
import { useState } from "react";
import { getLocalTimeZone } from "@internationalized/date";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  date: z.any().refine(val => val !== null && val !== undefined, "Date is required"),
  startTime: z.any().refine(val => val !== null && val !== undefined, "Start time is required"),
  duration: z.any().refine(val => val !== null && val !== undefined, "Duration is required"),
  frequency: z.string().min(1, "Frequency is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const EventForm = () => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: "not repeat",
      title: "",
      description: "",
      location: "",
    }
  });

  const selectedDate = useWatch({ control, name: "date" });
  const [isPending, setIsPending] = useState(false);

  // Generate dynamic frequency options
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  let dayOfWeekName = "day of the week";
  if (selectedDate) {
    const jsDate = selectedDate.toDate(getLocalTimeZone());
    dayOfWeekName = daysOfWeek[jsDate.getDay()];
  }

  const frequencyOptions = [
    { id: "not repeat", name: "not repeat" },
    { id: `weekly on ${dayOfWeekName}`, name: `weekly on ${dayOfWeekName}` },
    { id: `every other ${dayOfWeekName}`, name: `every other ${dayOfWeekName}` },
    { id: `monthly on the first ${dayOfWeekName}`, name: `monthly on the first ${dayOfWeekName}` },
    { id: "every workday", name: "every workday" },
  ];

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("location", data.location);
      
      const tz = getLocalTimeZone();
      const date = data.date;
      const time = data.startTime;
      const jsDate = date.toDate(tz);
      jsDate.setHours(time.hour, time.minute, time.second);
      formData.append("start_datetime", jsDate.toISOString());

      const durationStr = `${data.duration.hour.toString().padStart(2, '0')}:${data.duration.minute.toString().padStart(2, '0')}`;
      formData.append("duration", durationStr);
      formData.append("frequency", data.frequency);

      await createEvent(formData);
    } catch (e) {
      console.error(e);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            label="Title"
            isRequired
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.title?.message as string}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            label="Description"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.description?.message as string}
          />
        )}
      />
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <TextField
            label="Location"
            isRequired
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.location?.message as string}
          />
        )}
      />
      <DatePicker
        label="Date"
        isRequired
        onChange={(val) => setValue("date", val, { shouldValidate: true })}
        errorMessage={errors.date?.message as string}
      />
      <TimeField
        label="Start Time"
        isRequired
        hourCycle={24}
        onChange={(val) => setValue("startTime", val, { shouldValidate: true })}
        errorMessage={errors.startTime?.message as string}
      />
      <TimeField
        label="Duration (HH:mm)"
        isRequired
        hourCycle={24}
        onChange={(val) => setValue("duration", val, { shouldValidate: true })}
        errorMessage={errors.duration?.message as string}
      />
      <Select
        label="Frequency"
        defaultSelectedKey="not repeat"
        onSelectionChange={(key) => setValue("frequency", key as string, { shouldValidate: true })}
        items={frequencyOptions}
      >
        {(item: { id: string; name: string }) => <SelectItem id={item.id}>{item.name}</SelectItem>}
      </Select>
      <Button type="submit" isDisabled={isPending}>
        {isPending ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
};
