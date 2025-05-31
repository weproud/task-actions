import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validateYamlFiles } from '../../src/core/validation';

// Mock dependencies
jest.mock('../../src/generator', () => ({
	FileSystemUtils: {
		fileExists: jest.fn(),
		listFiles: jest.fn(),
		readFile: jest.fn()
	},
	TASK_ACTIONS_DIR: '.task-actions'
}));

const mockFileSystemUtils = jest.requireMock('../../src/generator').FileSystemUtils;

describe('Validation Utils', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('validateYamlFiles', () => {
		test('should validate directory with valid YAML files', async () => {
			const testDir = '/test/dir';
			const yamlFiles = ['file1.yaml', 'file2.yaml'];
			const validContent = 'version: 1\nkind: test\nname: test';

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockReturnValue(validContent);

			await validateYamlFiles(testDir);

			expect(mockFileSystemUtils.listFiles).toHaveBeenCalledWith(testDir, '.yaml');
			expect(mockFileSystemUtils.readFile).toHaveBeenCalledTimes(2);
			expect(console.log).toHaveBeenCalledWith('   ✅ file1.yaml: Valid');
			expect(console.log).toHaveBeenCalledWith('   ✅ file2.yaml: Valid');
		});

		test('should detect empty YAML files', async () => {
			const testDir = '/test/dir';
			const yamlFiles = ['empty.yaml'];

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockReturnValue('   \n  \t  ');

			await validateYamlFiles(testDir);

			expect(console.log).toHaveBeenCalledWith('   ❌ empty.yaml: Empty file');
		});

		test('should handle file read errors', async () => {
			const testDir = '/test/dir';
			const yamlFiles = ['error.yaml'];

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockImplementation(() => {
				throw new Error('Permission denied');
			});

			await validateYamlFiles(testDir);

			expect(console.log).toHaveBeenCalledWith(
				'   ❌ error.yaml: Read error - Error: Permission denied'
			);
		});

		test('should handle directory with no YAML files', async () => {
			const testDir = '/test/dir';

			mockFileSystemUtils.listFiles.mockReturnValue([]);

			await validateYamlFiles(testDir);

			expect(mockFileSystemUtils.listFiles).toHaveBeenCalledWith(testDir, '.yaml');
			expect(mockFileSystemUtils.readFile).not.toHaveBeenCalled();
		});
	});

	describe('Integration Tests', () => {
		test('should handle mixed valid and invalid files', async () => {
			const testDir = '/test/dir';
			const yamlFiles = ['valid.yaml', 'empty.yaml', 'error.yaml'];

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile
				.mockReturnValueOnce('version: 1\nkind: test') // valid
				.mockReturnValueOnce('') // empty
				.mockImplementationOnce(() => {
					throw new Error('Read error');
				}); // error

			await validateYamlFiles(testDir);

			expect(console.log).toHaveBeenCalledWith('   ✅ valid.yaml: Valid');
			expect(console.log).toHaveBeenCalledWith('   ❌ empty.yaml: Empty file');
			expect(console.log).toHaveBeenCalledWith(
				'   ❌ error.yaml: Read error - Error: Read error'
			);
		});
	});

	describe('Edge Cases', () => {
		test('should handle files with only whitespace', async () => {
			const testDir = '/test/dir';
			const yamlFiles = ['whitespace.yaml'];

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockReturnValue('   \n  \r\n  \t  \n  ');

			await validateYamlFiles(testDir);

			expect(console.log).toHaveBeenCalledWith('   ❌ whitespace.yaml: Empty file');
		});

		test('should handle very large file names', async () => {
			const testDir = '/test/dir';
			const longFileName = 'a'.repeat(200) + '.yaml';
			const yamlFiles = [longFileName];

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockReturnValue('version: 1');

			await validateYamlFiles(testDir);

			expect(console.log).toHaveBeenCalledWith(`   ✅ ${longFileName}: Valid`);
		});

		test('should handle special characters in file names', async () => {
			const testDir = '/test/dir';
			const specialFileName = 'file-with-特殊字符-and-émojis-🎯.yaml';
			const yamlFiles = [specialFileName];

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockReturnValue('version: 1');

			await validateYamlFiles(testDir);

			expect(console.log).toHaveBeenCalledWith(`   ✅ ${specialFileName}: Valid`);
		});
	});

	describe('Performance Tests', () => {
		test('should handle large number of files efficiently', async () => {
			const testDir = '/test/dir';
			const yamlFiles = Array.from({ length: 100 }, (_, i) => `file${i}.yaml`);

			mockFileSystemUtils.listFiles.mockReturnValue(yamlFiles);
			mockFileSystemUtils.readFile.mockReturnValue('version: 1');

			const startTime = Date.now();
			await validateYamlFiles(testDir);
			const endTime = Date.now();

			expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
			expect(mockFileSystemUtils.readFile).toHaveBeenCalledTimes(100);
		});
	});
});
