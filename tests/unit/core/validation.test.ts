import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	jest
} from '@jest/globals';
import * as fs from 'fs';
import {
	validateProject,
	validateYamlFiles
} from '../../../src/core/validation';
import {
	createTempDir,
	cleanupTempDir,
	captureConsoleOutput
} from '../../helpers/test-utils';

// fs 모듈 모킹
jest.mock('fs', () => ({
	existsSync: jest.fn(),
	readFileSync: jest.fn(),
	writeFileSync: jest.fn(),
	mkdirSync: jest.fn(),
	rmSync: jest.fn(),
	readdirSync: jest.fn(),
	statSync: jest.fn(),
	copyFileSync: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('Validation', () => {
	let tempDir: string;
	let consoleCapture: ReturnType<typeof captureConsoleOutput>;
	let originalCwd: string;

	beforeEach(() => {
		tempDir = createTempDir();
		originalCwd = process.cwd();
		process.chdir(tempDir);
		consoleCapture = captureConsoleOutput();
		jest.clearAllMocks();
	});

	afterEach(() => {
		process.chdir(originalCwd);
		cleanupTempDir(tempDir);
		consoleCapture.restore();
	});

	describe('validateProject', () => {
		it('should validate initialized project successfully', async () => {
			// 프로젝트가 초기화된 상태 모킹
			mockFs.existsSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				return (
					pathStr.includes('.task-actions') ||
					pathStr.includes('vars.yaml') ||
					pathStr.includes('tasks.yaml')
				);
			});

			mockFs.readdirSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				if (pathStr.includes('actions')) return ['test-action.yaml'] as any;
				if (pathStr.includes('workflows')) return ['test-workflow.yaml'] as any;
				if (pathStr.includes('mcps')) return ['test-mcp.yaml'] as any;
				if (pathStr.includes('rules')) return ['test-rule.yaml'] as any;
				return [] as any;
			});

			mockFs.readFileSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				if (pathStr.includes('vars.yaml')) {
					return 'projectName: test\nauthor: test' as any;
				}
				if (pathStr.includes('.yaml')) {
					return 'name: test\ndescription: test' as any;
				}
				return '' as any;
			});

			const result = await validateProject();

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should detect missing .task-actions directory', async () => {
			mockFs.existsSync.mockReturnValue(false);

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(
				result.errors.some((error) => error.includes('.task-actions'))
			).toBe(true);
		});

		it('should detect invalid YAML files', async () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readdirSync.mockReturnValue(['invalid.yaml']);
			mockFs.readFileSync.mockImplementation((path: any) => {
				if (path.toString().includes('invalid.yaml')) {
					return 'invalid: yaml: content: [';
				}
				return 'valid: yaml';
			});

			const result = await validateProject();

			expect(result.isValid).toBe(false);
			expect(result.errors.some((error) => error.includes('YAML'))).toBe(true);
		});
	});

	describe('validateYamlFiles', () => {
		it('should validate valid YAML files', () => {
			const validYaml = `name: test
description: test description
version: 1.0.0`;

			mockFs.existsSync.mockReturnValue(true);
			mockFs.readdirSync.mockReturnValue(['test.yaml']);
			mockFs.readFileSync.mockReturnValue(validYaml);

			const result = validateYamlFiles(tempDir);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should detect invalid YAML syntax', () => {
			const invalidYaml = `name: test
description: [invalid yaml
version: 1.0.0`;

			mockFs.existsSync.mockReturnValue(true);
			mockFs.readdirSync.mockReturnValue(['invalid.yaml']);
			mockFs.readFileSync.mockReturnValue(invalidYaml);

			const result = validateYamlFiles(tempDir);

			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should handle empty directory', () => {
			mockFs.existsSync.mockReturnValue(false);

			const result = validateYamlFiles(tempDir);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should validate nested directories', () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readdirSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				if (pathStr === tempDir) return ['subdir'];
				if (pathStr.includes('subdir')) return ['nested.yaml'];
				return [];
			});

			mockFs.statSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				return {
					isDirectory: () =>
						pathStr.includes('subdir') && !pathStr.includes('.yaml'),
					isFile: () => pathStr.includes('.yaml')
				} as any;
			});

			mockFs.readFileSync.mockReturnValue('name: nested\ndescription: test');

			const result = validateYamlFiles(tempDir);

			expect(result.isValid).toBe(true);
		});
	});
});
