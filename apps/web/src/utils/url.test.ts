import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getURL } from './url';

describe('getURL', () => {
	beforeEach(() => {
		vi.stubGlobal('process', {
			env: {}
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should return localhost default when no env vars are set', () => {
		expect(getURL()).toBe('http://localhost:3000/');
	});

	it('should respect NEXT_PUBLIC_SITE_URL and append trailing slash and https', () => {
		process.env.NEXT_PUBLIC_SITE_URL = 'noria.app';
		expect(getURL()).toBe('https://noria.app/');
	});

	it('should respect NEXT_PUBLIC_VERCEL_URL and preserve http protocol', () => {
		process.env.NEXT_PUBLIC_VERCEL_URL = 'http://noria-vercel.app/';
		expect(getURL()).toBe('http://noria-vercel.app/');
	});
});
