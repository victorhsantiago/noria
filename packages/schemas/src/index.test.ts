import { describe, it, expect } from 'vitest';
import { EventSchema, RsvpStatusSchema } from './index';

describe('EventSchema', () => {
	it('should validate a valid event', () => {
		const validEvent = {
			title: 'Sprint Planning',
			description: 'Plan the upcoming sprint tasks.',
			location: 'Conference Room Zoom',
			start_datetime: '2026-07-20T10:00:00Z',
			duration: '01:30',
			frequency: 'weekly on Monday',
			parent_event_id: '3ab13120-5802-4c71-ba60-b6f6d122171c',
			recurrence_group_id: 'cd31924d-bc0f-4ed6-91cb-afd7183e9cf4',
		};

		const parsed = EventSchema.parse(validEvent);
		expect(parsed.title).toBe('Sprint Planning');
		expect(parsed.frequency).toBe('weekly on Monday');
	});

	it('should validate optional recurrence fields when missing', () => {
		const eventWithoutRecurrence = {
			title: 'One-off Sync',
			location: 'Desk 4',
			start_datetime: '2026-07-20T10:00:00Z',
			duration: '00:30',
			frequency: 'not repeat',
		};

		const parsed = EventSchema.parse(eventWithoutRecurrence);
		expect(parsed.parent_event_id).toBeUndefined();
		expect(parsed.recurrence_group_id).toBeUndefined();
	});

	it('should reject invalid title length', () => {
		const invalidEvent = {
			title: 'a'.repeat(101), // exceeds max 100
			location: 'Desk 4',
			start_datetime: '2026-07-20T10:00:00Z',
			duration: '00:30',
			frequency: 'not repeat',
		};

		expect(() => {
			EventSchema.parse(invalidEvent);
		}).toThrowError(/Title cannot exceed 100 characters/);
	});

	it('should reject invalid description length', () => {
		const invalidEvent = {
			title: 'Valid Title',
			description: 'a'.repeat(501), // exceeds max 500
			location: 'Desk 4',
			start_datetime: '2026-07-20T10:00:00Z',
			duration: '00:30',
			frequency: 'not repeat',
		};

		expect(() => {
			EventSchema.parse(invalidEvent);
		}).toThrowError(/Description cannot exceed 500 characters/);
	});

	it('should reject invalid UUID format in recurrence fields', () => {
		const invalidEvent = {
			title: 'Valid Title',
			location: 'Desk 4',
			start_datetime: '2026-07-20T10:00:00Z',
			duration: '00:30',
			frequency: 'not repeat',
			parent_event_id: 'invalid-uuid-format',
		};

		expect(() => {
			EventSchema.parse(invalidEvent);
		}).toThrowError(/Invalid UUID/);
	});
});

describe('RsvpStatusSchema', () => {
	it('should validate valid RSVP statuses', () => {
		expect(RsvpStatusSchema.parse('Going')).toBe('Going');
		expect(RsvpStatusSchema.parse('Maybe')).toBe('Maybe');
		expect(RsvpStatusSchema.parse('Not Going')).toBe('Not Going');
	});

	it('should reject invalid RSVP statuses', () => {
		expect(() => {
			RsvpStatusSchema.parse('Interested');
		}).toThrowError();

		expect(() => {
			RsvpStatusSchema.parse('Going!');
		}).toThrowError();
	});
});
