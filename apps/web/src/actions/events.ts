'use server';

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const eventSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
	description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
	location: z
		.string()
		.min(1, 'Location is required')
		.max(150, 'Location cannot exceed 150 characters'),
	start_datetime: z.string(),
	duration: z.string().min(1, 'Duration is required'),
	frequency: z.string().min(1, 'Frequency is required'),
});

export async function createEvent(formData: FormData) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login');
	}

	const rawData = {
		title: formData.get('title')?.toString() || '',
		description: formData.get('description')?.toString() || undefined,
		location: formData.get('location')?.toString() || '',
		start_datetime: formData.get('start_datetime')?.toString() || '',
		duration: formData.get('duration')?.toString() || '',
		frequency: formData.get('frequency')?.toString() || '',
	};

	const parsed = eventSchema.parse(rawData);

	const { error } = await supabase
		.from('events')
		.insert({
			title: parsed.title,
			description: parsed.description || null,
			location: parsed.location,
			start_datetime: parsed.start_datetime,
			duration: parsed.duration,
			frequency: parsed.frequency,
			organizer_id: user.id,
		})
		.select()
		.single();

	if (error) {
		return { error: error.message };
	}

	return { success: true };
}
