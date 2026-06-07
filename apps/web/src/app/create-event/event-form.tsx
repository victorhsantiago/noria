'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	TextField,
	Button,
	Select,
	SelectItem,
	TimeField,
	DatePicker,
	toastQueue,
	TextArea,
	Flex,
} from '@noria/ui';
import { useRouter } from 'next/navigation';
import { useCreateEvent } from '@/hooks/use-events';
import { useState } from 'react';
import { getLocalTimeZone, CalendarDate, Time, today, now } from '@internationalized/date';

const formSchema = z
	.object({
		title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
		description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
		location: z
			.string()
			.min(1, 'Location is required')
			.max(150, 'Location cannot exceed 150 characters'),
		date: z.instanceof(CalendarDate, { message: 'Date is required' }),
		startTime: z.instanceof(Time, { message: 'Start time is required' }),
		duration: z.instanceof(Time, { message: 'Duration is required' }),
		frequency: z.string().min(1, 'Frequency is required'),
	})
	.strict();

type FormValues = z.infer<typeof formSchema>;

export const EventForm = () => {
	const router = useRouter();

	const [initialStartTime] = useState(() => {
		const current = now(getLocalTimeZone());
		let startHour = current.hour + 1;
		if (current.minute >= 30) {
			startHour += 1;
		}
		return new Time(startHour % 24, 0);
	});

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			frequency: 'not repeat',
			title: '',
			description: '',
			location: '',
			date: today(getLocalTimeZone()),
			startTime: initialStartTime,
			duration: new Time(2, 0),
		},
	});

	const selectedDate = useWatch({ control, name: 'date' });
	const { mutate: createEventMutation, isPending } = useCreateEvent();

	// Generate dynamic frequency options
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let dayOfWeekName = 'day of the week';
	let isWorkday = false;
	if (selectedDate) {
		const jsDate = selectedDate.toDate(getLocalTimeZone());
		const day = jsDate.getDay();
		dayOfWeekName = daysOfWeek[day];
		isWorkday = day >= 1 && day <= 5;
	}

	const isToday = selectedDate?.compare(today(getLocalTimeZone())) === 0;
	const current = now(getLocalTimeZone());
	const minTime = isToday ? new Time(current.hour, current.minute) : undefined;

	const frequencyOptions = [
		{ id: 'not repeat', name: 'not repeat' },
		{ id: `weekly on ${dayOfWeekName}`, name: `weekly on ${dayOfWeekName}` },
		{ id: `every other ${dayOfWeekName}`, name: `every other ${dayOfWeekName}` },
		{ id: `monthly on the first ${dayOfWeekName}`, name: `monthly on the first ${dayOfWeekName}` },
		...(isWorkday ? [{ id: 'every workday', name: 'every workday' }] : []),
	];

	const onSubmit = (data: FormValues) => {
		const formData = new FormData();
		formData.append('title', data.title);
		if (data.description) formData.append('description', data.description);
		formData.append('location', data.location);

		const tz = getLocalTimeZone();
		const date = data.date;
		const time = data.startTime;
		const jsDate = date.toDate(tz);
		jsDate.setHours(time.hour, time.minute, time.second);
		formData.append('start_datetime', jsDate.toISOString());

		const durationStr = `${data.duration.hour.toString().padStart(2, '0')}:${data.duration.minute.toString().padStart(2, '0')}`;
		formData.append('duration', durationStr);
		formData.append('frequency', data.frequency);

		createEventMutation(formData, {
			onSuccess: () => {
				toastQueue.add(
					{ title: 'Event Created', description: 'Your new event is ready.', type: 'success' },
					{ timeout: 4000 },
				);
				router.push('/');
			},
			onError: (e: Error) => {
				console.error(e);
				toastQueue.add(
					{
						title: 'Creation Failed',
						description: e.message || 'There was an error creating the event.',
						type: 'danger',
					},
					{ timeout: 5000 },
				);
			},
		});
	};

	return (
		<Flex as="form" onSubmit={handleSubmit(onSubmit)} direction="column" gap="sm">
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						label="Title"
						isRequired
						maxLength={100}
						value={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						errorMessage={errors.title?.message as string}
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
						maxLength={150}
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
				minValue={today(getLocalTimeZone())}
				value={selectedDate}
				onChange={(val) => setValue('date', val as CalendarDate, { shouldValidate: true })}
				errorMessage={errors.date?.message as string}
			/>
			<Flex gap="sm">
				<TimeField
					label="Start Time"
					isRequired
					hourCycle={24}
					granularity="minute"
					defaultValue={initialStartTime}
					minValue={minTime}
					onChange={(val) => setValue('startTime', val as Time, { shouldValidate: true })}
					errorMessage={errors.startTime?.message as string}
				/>

				<TimeField
					label="Duration (HH:mm)"
					isRequired
					hourCycle={24}
					granularity="minute"
					defaultValue={new Time(2, 0)}
					onChange={(val) => setValue('duration', val as Time, { shouldValidate: true })}
					errorMessage={errors.duration?.message as string}
				/>
			</Flex>

			<Select
				label="Frequency"
				defaultValue="not repeat"
				onChange={(key) => setValue('frequency', key as string, { shouldValidate: true })}
				items={frequencyOptions}
			>
				{(item: { id: string; name: string }) => <SelectItem id={item.id}>{item.name}</SelectItem>}
			</Select>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextArea
						label="Description"
						maxLength={500}
						rows={3}
						value={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						errorMessage={errors.description?.message as string}
					/>
				)}
			/>

			<Button type="submit" variant="primary" isDisabled={isPending}>
				{isPending ? 'Creating...' : 'Create Event'}
			</Button>
		</Flex>
	);
};
