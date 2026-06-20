import { describe, it, expect } from 'vitest';
import {
	generateGoogleCalendarUrl,
	generateYahooCalendarUrl,
	generateOutlookCalendarUrl,
	generateIcsContent,
} from './calendar';
import type { EventWithRSVPs } from '@/hooks/use-dashboard';

const dummyEvent: EventWithRSVPs = {
	id: '3ab13120-5802-4c71-ba60-b6f6d122171c',
	title: 'Project Kickoff',
	description: 'Kickoff meeting for project Noria.',
	location: 'Conference Room 1',
	start_datetime: '2026-07-20T10:00:00.000Z',
	duration: '01:30',
	frequency: 'not repeat',
	organizer_id: 'user-id-123',
	parent_event_id: null,
	recurrence_group_id: null,
	created_at: '2026-06-20T12:00:00Z',
	updated_at: '2026-06-20T12:00:00Z',
	attendees: [],
	goingCount: 0,
	maybeCount: 0,
	notGoingCount: 0,
};

describe('calendar utilities', () => {
	it('should generate Google calendar url correctly', () => {
		const url = generateGoogleCalendarUrl(dummyEvent);
		expect(url).toContain('https://calendar.google.com/calendar/render');
		expect(url).toContain('action=TEMPLATE');
		expect(url).toContain('text=Project+Kickoff');
		// 10:00 UTC start to 11:30 UTC end (dur: 1h30m)
		expect(url).toContain('dates=20260720T100000Z%2F20260720T113000Z');
		expect(url).toContain('location=Conference+Room+1');
	});

	it('should generate Yahoo calendar url correctly', () => {
		const url = generateYahooCalendarUrl(dummyEvent);
		expect(url).toContain('https://calendar.yahoo.com/');
		expect(url).toContain('v=60');
		expect(url).toContain('title=Project+Kickoff');
		expect(url).toContain('st=20260720T100000Z');
		expect(url).toContain('et=20260720T113000Z');
	});

	it('should generate Outlook calendar url correctly', () => {
		const url = generateOutlookCalendarUrl(dummyEvent);
		expect(url).toContain('https://outlook.live.com/calendar/0/deeplink/compose');
		expect(url).toContain('subject=Project+Kickoff');
		expect(url).toContain('startdt=2026-07-20T10%3A00%3A00.000Z');
		expect(url).toContain('enddt=2026-07-20T11%3A30%3A00.000Z');
	});

	it('should generate ICS file content correctly', () => {
		const ics = generateIcsContent(dummyEvent);
		expect(ics).toContain('BEGIN:VCALENDAR');
		expect(ics).toContain('SUMMARY:Project Kickoff');
		expect(ics).toContain('DTSTART:20260720T100000Z');
		expect(ics).toContain('DTEND:20260720T113000Z');
		expect(ics).toContain('LOCATION:Conference Room 1');
		expect(ics).toContain('END:VCALENDAR');
	});
});
