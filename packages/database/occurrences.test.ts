import { describe, it, expect } from 'vitest';
import { generateOccurrences, generateOccurrencesOneYear } from './occurrences';

describe('generateOccurrences', () => {
	it('should return empty occurrences array for "not repeat"', () => {
		const anchor = new Date('2026-07-13T10:00:00.000Z');
		const horizon = new Date('2027-07-13T10:00:00.000Z');
		const results = generateOccurrences(anchor, 'not repeat', horizon);
		expect(results.length).toBe(0);
	});

	it('should generate weekly occurrences on Monday correctly', () => {
		// July 13, 2026 is a Monday
		const anchor = new Date('2026-07-13T10:00:00');
		const results = generateOccurrencesOneYear(anchor, 'weekly on Monday');

		expect(results.length).toBe(52);
		// Check the first occurrence is 7 days later
		expect(results[0].getDate()).toBe(20);
		expect(results[0].getMonth()).toBe(6); // July (0-indexed)
		expect(results[0].getHours()).toBe(10);
		expect(results[0].getMinutes()).toBe(0);

		// Check the last occurrence is within 1 year
		const oneYearLater = new Date(anchor);
		oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
		expect(results[results.length - 1].getTime()).toBeLessThanOrEqual(oneYearLater.getTime());
	});

	it('should generate bi-weekly occurrences correctly', () => {
		// July 13, 2026 is a Monday
		const anchor = new Date('2026-07-13T14:30:00');
		const results = generateOccurrencesOneYear(anchor, 'every other Monday');

		expect(results.length).toBe(26);
		// Check the first occurrence is 14 days later
		expect(results[0].getDate()).toBe(27);
		expect(results[0].getMonth()).toBe(6); // July (0-indexed)
		expect(results[0].getHours()).toBe(14);
		expect(results[0].getMinutes()).toBe(30);
	});

	it('should generate monthly occurrences on first Monday correctly', () => {
		// July 6, 2026 is the first Monday of July
		const anchor = new Date('2026-07-06T09:00:00');
		const results = generateOccurrencesOneYear(anchor, 'monthly on the first Monday');

		expect(results.length).toBe(12);

		// First occurrence: August 3, 2026 (first Monday of Aug)
		expect(results[0].getFullYear()).toBe(2026);
		expect(results[0].getMonth()).toBe(7); // August (0-indexed)
		expect(results[0].getDate()).toBe(3);
		expect(results[0].getDay()).toBe(1); // Monday

		// Second occurrence: September 7, 2026 (first Monday of Sept)
		expect(results[1].getFullYear()).toBe(2026);
		expect(results[1].getMonth()).toBe(8); // September (0-indexed)
		expect(results[1].getDate()).toBe(7);
		expect(results[1].getDay()).toBe(1); // Monday
	});

	it('should generate workday occurrences correctly skipping weekends', () => {
		// Friday, July 10, 2026
		const anchor = new Date('2026-07-10T10:00:00');
		const results = generateOccurrencesOneYear(anchor, 'every workday');

		// It should skip weekends: July 11 (Sat) and July 12 (Sun)
		// First occurrence should be Monday, July 13
		expect(results[0].getFullYear()).toBe(2026);
		expect(results[0].getMonth()).toBe(6); // July (0-indexed)
		expect(results[0].getDate()).toBe(13);
		expect(results[0].getDay()).toBe(1); // Monday

		// Second occurrence should be Tuesday, July 14
		expect(results[1].getDate()).toBe(14);
		expect(results[1].getDay()).toBe(2); // Tuesday

		// Verify no weekends are generated
		for (const date of results) {
			const day = date.getDay();
			expect(day).toBeGreaterThanOrEqual(1);
			expect(day).toBeLessThanOrEqual(5);
		}
	});
});
