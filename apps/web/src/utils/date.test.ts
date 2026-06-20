import { describe, it, expect } from 'vitest';
import {
	formatEventDate,
	formatFullDateTime,
	formatEventDateOnly,
	formatTimeOnly,
} from './date';

describe('date formatting utilities', () => {
	const testDate = new Date('2026-07-20T14:30:00Z');

	it('should format event date to short locale string with time', () => {
		const formatted = formatEventDate(testDate);
		// Under en-GB, 20 July at 14:30. Let's check for key components:
		expect(formatted).toContain('20');
		expect(formatted).toContain('Jul');
		expect(formatted).toContain('14:30');
	});

	it('should format full date time', () => {
		const formatted = formatFullDateTime(testDate);
		expect(formatted).toContain('20/07/2026');
		expect(formatted).toContain('14:30');
	});

	it('should format event date only', () => {
		const formatted = formatEventDateOnly(testDate);
		expect(formatted).toContain('Monday');
		expect(formatted).toContain('July');
		expect(formatted).toContain('2026');
	});

	it('should format time only', () => {
		const formatted = formatTimeOnly(testDate);
		// Local time depending on timezone offset, but we can verify it contains ':'
		expect(formatted).toMatch(/^\d{2}:\d{2}$/);
	});
});
