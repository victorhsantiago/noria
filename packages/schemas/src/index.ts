import { z } from 'zod';

export const RsvpStatusSchema = z.enum(['Going', 'Maybe', 'Not Going']);
export type RsvpStatus = z.infer<typeof RsvpStatusSchema>;

export const EventSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
	description: z
		.string()
		.max(500, 'Description cannot exceed 500 characters')
		.nullable()
		.optional(),
	location: z
		.string()
		.min(1, 'Location is required')
		.max(150, 'Location cannot exceed 150 characters'),
	start_datetime: z.string(),
	duration: z.string().min(1, 'Duration is required').nullable().optional(),
	frequency: z.string().min(1, 'Frequency is required'),
});

export type Event = z.infer<typeof EventSchema>;
