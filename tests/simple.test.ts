import { describe, it, expect } from '@jest/globals';

describe('Simple Test', () => {
	it('should pass basic test', () => {
		expect(1 + 1).toBe(2);
	});

	it('should handle strings', () => {
		expect('hello').toBe('hello');
	});

	it('should handle arrays', () => {
		const arr = [1, 2, 3];
		expect(arr).toHaveLength(3);
		expect(arr).toContain(2);
	});
});
