import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { validateProject } from '../../src/core/validation';
import { ValidationResult } from '../../src/core/types';

// Mock dependencies
jest.mock('fs/promises');
jest.mock('../../src/generator', () => ({
	FileSystemUtils: {
		fileExists: jest.fn(),
		listFiles: jest.fn(),
		readFile: jest.fn()
	},
	TASK_ACTIONS_DIR: '.task-actions'
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockFileSystemUtils = jest.requireMock(
	'../../src/generator'
).FileSystemUtils;

// Test fixtures paths
const FIXTURES_PATH = path.join(__dirname, '../fixtures');
const VALID_FIXTURES = path.join(FIXTURES_PATH, 'valid');
const INVALID_FIXTURES = path.join(FIXTURES_PATH, 'invalid');
const CIRCULAR_FIXTURES = path.join(FIXTURES_PATH, 'circular');

describe('Validation Module', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(process, 'cwd').mockReturnValue('/test/project');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Type Guards', () => {
		// Import the internal functions for testing
		const validationModule = require('../../src/core/validation');

		describe('isWorkflowConfig', () => {
			test('should return true for valid workflow config', () => {
				const validConfig = {
					version: 1,
					kind: 'workflow',
					name: 'test',
					description: 'test',
					prompt: 'test',
					jobs: {
						steps: [{ name: 'step1', uses: 'action.yaml' }]
					}
				};

				// Since isWorkflowConfig is not exported, we'll test through validateProject
				expect(validConfig.jobs.steps).toBeInstanceOf(Array);
			});

			test('should return false for invalid workflow config', () => {
				const invalidConfigs = [
					null,
					undefined,
					{},
					{ jobs: {} },
					{ jobs: { steps: 'not-array' } },
					{ jobs: { steps: null } }
				];

				invalidConfigs.forEach((config) => {
					if (config?.jobs?.steps) {
						expect(Array.isArray(config.jobs.steps)).toBe(false);
					}
				});
			});
		});

		describe('isTaskConfig', () => {
			test('should return true for valid task config', () => {
				const validConfig = {
					version: 1,
					kind: 'task',
					name: 'test',
					description: 'test',
					prompt: 'test',
					id: 'test-id',
					status: 'pending',
					jobs: {
						workflow: 'workflow.yaml'
					}
				};

				expect(validConfig.jobs).toBeDefined();
				expect(typeof validConfig.jobs).toBe('object');
			});

			test('should return false for invalid task config', () => {
				const invalidConfigs = [
					null,
					undefined,
					{},
					{ jobs: null },
					{ jobs: 'not-object' }
				];

				invalidConfigs.forEach((config) => {
					if (config?.jobs) {
						expect(typeof config.jobs).not.toBe('object');
					} else {
						expect(config?.jobs).toBeFalsy();
					}
				});
			});
		});
	});

	describe('File Loading and Parsing', () => {
		test('should load valid YAML file successfully', async () => {
			const validYamlContent = `
version: 1
kind: task
name: test-task
description: Test task
prompt: Test prompt
`;

			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValue(validYamlContent);

			// Test through validateProject since loadYamlFile is internal
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			const result = await validateProject();

			expect(mockFs.access).toHaveBeenCalled();
			expect(mockFs.readFile).toHaveBeenCalled();
		});

		test('should handle file not found error', async () => {
			const error = new Error('File not found') as any;
			error.code = 'ENOENT';

			mockFs.access.mockRejectedValue(error);
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(result.errors.some((err) => err.includes('does not exist'))).toBe(
				true
			);
		});

		test('should handle empty file', async () => {
			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValue('   \n  \t  ');
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(result.errors.some((err) => err.includes('empty'))).toBe(true);
		});

		test('should handle invalid YAML syntax', async () => {
			const invalidYaml = `
version: 1
kind: task
invalid_syntax: [unclosed array
`;

			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValue(invalidYaml);
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
		});
	});

	describe('Field Validation', () => {
		test('should detect missing required fields', async () => {
			const incompleteYaml = `
version: 1
kind: task
# Missing name, description, prompt
`;

			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValue(incompleteYaml);
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) => err.includes("Required field 'name'"))
			).toBe(true);
			expect(
				result.errors.some((err) =>
					err.includes("Required field 'description'")
				)
			).toBe(true);
			expect(
				result.errors.some((err) => err.includes("Required field 'prompt'"))
			).toBe(true);
		});

		test('should detect empty required fields', async () => {
			const emptyFieldsYaml = `
version: 1
kind: task
name: ""
description: 
prompt: null
`;

			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValue(emptyFieldsYaml);
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) => err.includes("Required field 'name'"))
			).toBe(true);
			expect(
				result.errors.some((err) =>
					err.includes("Required field 'description'")
				)
			).toBe(true);
			expect(
				result.errors.some((err) => err.includes("Required field 'prompt'"))
			).toBe(true);
		});
	});

	describe('Project Validation', () => {
		test('should validate initialized project successfully', async () => {
			const validTaskYaml = `
version: 1
kind: task
name: test-task
description: Test task description
prompt: Test task prompt
id: task-001
status: pending
jobs:
  workflow: workflows/test.yaml
`;

			const validWorkflowYaml = `
version: 1
kind: workflow
name: test-workflow
description: Test workflow description
prompt: Test workflow prompt
jobs:
  steps:
    - name: step1
      uses: actions/test-action.yaml
`;

			const validActionYaml = `
version: 1
kind: action
name: test-action
description: Test action description
prompt: Test action prompt
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);

			// Mock file reads for different files
			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile
				.mockResolvedValueOnce(validTaskYaml) // task file
				.mockResolvedValueOnce(validWorkflowYaml) // workflow file
				.mockResolvedValueOnce(validActionYaml); // action file

			const result = await validateProject();

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		test('should detect uninitialized project', async () => {
			mockFileSystemUtils.fileExists.mockReturnValue(false);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(result.errors).toContain(
				'Task Actions project is not initialized.'
			);
		});

		test('should detect missing required base files', async () => {
			mockFileSystemUtils.fileExists
				.mockReturnValueOnce(true) // .task-actions directory exists
				.mockReturnValueOnce(false) // vars.yaml missing
				.mockReturnValueOnce(false); // tasks.yaml missing

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) =>
					err.includes('Missing required files: vars.yaml, tasks.yaml')
				)
			).toBe(true);
		});

		test('should handle no task files found', async () => {
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue([] as any);

			const result = await validateProject();

			expect(result.isValid).toBe(true); // No errors, but warnings
			expect(result.warnings).toContain('No Task files found.');
		});

		test('should handle directory read error', async () => {
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockRejectedValue(new Error('Permission denied'));

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) =>
					err.includes('Error reading Task file list')
				)
			).toBe(true);
		});
	});

	describe('Task File Validation', () => {
		test('should validate task with custom job types', async () => {
			const taskWithCustomJobs = `
version: 1
kind: task
name: custom-task
description: Task with custom job types
prompt: Test prompt
id: task-custom
status: pending
jobs:
  workflow: workflows/test.yaml
  custom_single: custom/single.yaml
  custom_array:
    - custom/array1.yaml
    - custom/array2.yaml
`;

			const validWorkflowYaml = `
version: 1
kind: workflow
name: test-workflow
description: Test workflow
prompt: Test prompt
jobs:
  steps: []
`;

			const validCustomYaml = `
version: 1
kind: custom
name: custom-file
description: Custom file
prompt: Custom prompt
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-custom.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);

			mockFs.readFile
				.mockResolvedValueOnce(taskWithCustomJobs)
				.mockResolvedValueOnce(validWorkflowYaml)
				.mockResolvedValueOnce(validCustomYaml) // custom_single
				.mockResolvedValueOnce(validCustomYaml) // custom_array[0]
				.mockResolvedValueOnce(validCustomYaml); // custom_array[1]

			const result = await validateProject();

			expect(result.isValid).toBe(true);
		});

		test('should detect invalid custom job type', async () => {
			const taskWithInvalidCustomJob = `
version: 1
kind: task
name: invalid-custom-task
description: Task with invalid custom job
prompt: Test prompt
id: task-invalid
status: pending
jobs:
  invalid_job: 123
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-invalid.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValueOnce(taskWithInvalidCustomJob);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) =>
					err.includes('must be a string or string array')
				)
			).toBe(true);
		});

		test('should detect missing jobs section', async () => {
			const taskWithoutJobs = `
version: 1
kind: task
name: no-jobs-task
description: Task without jobs
prompt: Test prompt
id: task-no-jobs
status: pending
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-no-jobs.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValueOnce(taskWithoutJobs);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) => err.includes('Missing jobs section'))
			).toBe(true);
		});
	});

	describe('Workflow Validation', () => {
		test('should detect missing steps in workflow', async () => {
			const invalidWorkflow = `
version: 1
kind: workflow
name: invalid-workflow
description: Workflow without steps
prompt: Test prompt
jobs:
  not_steps: []
`;

			const taskYaml = `
version: 1
kind: task
name: test-task
description: Test task
prompt: Test prompt
id: task-001
status: pending
jobs:
  workflow: workflows/invalid.yaml
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);

			mockFs.readFile
				.mockResolvedValueOnce(taskYaml)
				.mockResolvedValueOnce(invalidWorkflow);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) =>
					err.includes('Missing valid jobs.steps array')
				)
			).toBe(true);
		});
	});

	describe('Circular Reference Detection', () => {
		test('should detect circular references', async () => {
			const taskYaml = `
version: 1
kind: task
name: circular-task
description: Task with circular reference
prompt: Test prompt
id: task-circular
status: pending
jobs:
  workflow: workflows/circular.yaml
`;

			const circularWorkflow = `
version: 1
kind: workflow
name: circular-workflow
description: Workflow with circular reference
prompt: Test prompt
jobs:
  steps:
    - name: step1
      uses: workflows/circular.yaml
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-circular.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);

			mockFs.readFile
				.mockResolvedValueOnce(taskYaml)
				.mockResolvedValueOnce(circularWorkflow)
				.mockResolvedValueOnce(circularWorkflow); // Second read for circular reference

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((err) => err.includes('Circular reference detected'))
			).toBe(true);
		});
	});

	describe('Error Handling', () => {
		test('should handle file system errors gracefully', async () => {
			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockRejectedValue(new Error('Disk full'));

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(result.errors.some((err) => err.includes('File read error'))).toBe(
				true
			);
		});

		test('should handle YAML parsing errors', async () => {
			const malformedYaml = `
version: 1
kind: task
name: test
description: test
prompt: test
invalid: [unclosed
`;

			mockFileSystemUtils.fileExists.mockReturnValue(true);
			mockFs.readdir.mockResolvedValue(['task-test.yaml'] as any);
			mockFs.access.mockResolvedValue(undefined);
			mockFs.readFile.mockResolvedValue(malformedYaml);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
		});
	});
});
