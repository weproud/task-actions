// Jest setup file for validation tests
import { jest } from '@jest/globals';

// Global test setup
beforeAll(() => {
	// Suppress console output during tests unless explicitly testing it
	jest.spyOn(console, 'log').mockImplementation(() => {});
	jest.spyOn(console, 'error').mockImplementation(() => {});
	jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
	jest.restoreAllMocks();
});

// Global test utilities
global.testUtils = {
	createValidTaskYaml: (overrides = {}) => {
		const defaults = {
			version: 1,
			kind: 'task',
			name: 'test-task',
			description: 'Test task description',
			prompt: 'Test task prompt',
			id: 'task-001',
			status: 'pending',
			jobs: {
				workflow: 'workflows/test.yaml'
			}
		};
		return { ...defaults, ...overrides };
	},

	createValidWorkflowYaml: (overrides = {}) => {
		const defaults = {
			version: 1,
			kind: 'workflow',
			name: 'test-workflow',
			description: 'Test workflow description',
			prompt: 'Test workflow prompt',
			jobs: {
				steps: [
					{ name: 'step1', uses: 'actions/test.yaml' }
				]
			}
		};
		return { ...defaults, ...overrides };
	},

	createValidActionYaml: (overrides = {}) => {
		const defaults = {
			version: 1,
			kind: 'action',
			name: 'test-action',
			description: 'Test action description',
			prompt: 'Test action prompt'
		};
		return { ...defaults, ...overrides };
	}
};

// Type declarations for global utilities
declare global {
	var testUtils: {
		createValidTaskYaml: (overrides?: any) => any;
		createValidWorkflowYaml: (overrides?: any) => any;
		createValidActionYaml: (overrides?: any) => any;
	};
}
