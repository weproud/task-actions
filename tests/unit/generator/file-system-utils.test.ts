import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	jest
} from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import { FileSystemUtils } from '../../../src/generator/file-system-utils';

// fs 모듈 모킹
jest.mock('fs', () => ({
	existsSync: jest.fn(),
	readFileSync: jest.fn(),
	writeFileSync: jest.fn(),
	mkdirSync: jest.fn(),
	rmSync: jest.fn(),
	readdirSync: jest.fn(),
	statSync: jest.fn(),
	unlinkSync: jest.fn(),
	copyFileSync: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('FileSystemUtils', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('fileExists', () => {
		it('should return true for existing file', () => {
			mockFs.existsSync.mockReturnValue(true);

			const result = FileSystemUtils.fileExists('/path/to/file.txt');

			expect(result).toBe(true);
			expect(mockFs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
		});

		it('should return false for non-existing file', () => {
			mockFs.existsSync.mockReturnValue(false);

			const result = FileSystemUtils.fileExists('/path/to/missing.txt');

			expect(result).toBe(false);
		});
	});

	describe('ensureDirectoryExists', () => {
		it('should create directory if it does not exist', () => {
			mockFs.existsSync.mockReturnValue(false);
			mockFs.mkdirSync.mockImplementation(() => undefined);

			FileSystemUtils.ensureDirectoryExists('/path/to/dir');

			expect(mockFs.mkdirSync).toHaveBeenCalledWith('/path/to/dir', {
				recursive: true
			});
		});

		it('should not create directory if it already exists', () => {
			mockFs.existsSync.mockReturnValue(true);

			FileSystemUtils.ensureDirectoryExists('/existing/dir');

			expect(mockFs.mkdirSync).not.toHaveBeenCalled();
		});
	});

	describe('writeFile', () => {
		it('should write file with content', () => {
			mockFs.existsSync.mockReturnValue(true); // directory exists
			mockFs.writeFileSync.mockImplementation(() => undefined);

			FileSystemUtils.writeFile('/path/to/file.txt', 'content');

			expect(mockFs.writeFileSync).toHaveBeenCalledWith(
				'/path/to/file.txt',
				'content',
				'utf8'
			);
		});

		it('should create directory before writing file', () => {
			mockFs.existsSync.mockReturnValue(false);
			mockFs.mkdirSync.mockImplementation(() => undefined);
			mockFs.writeFileSync.mockImplementation(() => undefined);

			FileSystemUtils.writeFile('/new/path/file.txt', 'content');

			expect(mockFs.mkdirSync).toHaveBeenCalledWith('/new/path', {
				recursive: true
			});
			expect(mockFs.writeFileSync).toHaveBeenCalled();
		});
	});

	describe('readFile', () => {
		it('should read file content', () => {
			mockFs.readFileSync.mockReturnValue('file content');

			const result = FileSystemUtils.readFile('/path/to/file.txt');

			expect(result).toBe('file content');
			expect(mockFs.readFileSync).toHaveBeenCalledWith(
				'/path/to/file.txt',
				'utf8'
			);
		});

		it('should handle file read error', () => {
			mockFs.readFileSync.mockImplementation(() => {
				throw new Error('File not found');
			});

			expect(() => {
				FileSystemUtils.readFile('/missing/file.txt');
			}).toThrow('File not found');
		});
	});

	describe('copyFile', () => {
		it('should copy file from source to destination', () => {
			mockFs.existsSync.mockImplementation((path: any) => {
				return path.toString().includes('source');
			});
			mockFs.readFileSync.mockReturnValue('source content');
			mockFs.mkdirSync.mockImplementation(() => undefined);
			mockFs.writeFileSync.mockImplementation(() => undefined);

			FileSystemUtils.copyFile('/source/file.txt', '/dest/file.txt');

			expect(mockFs.readFileSync).toHaveBeenCalledWith(
				'/source/file.txt',
				'utf8'
			);
			expect(mockFs.writeFileSync).toHaveBeenCalledWith(
				'/dest/file.txt',
				'source content',
				'utf8'
			);
		});

		it('should throw error if source file does not exist', () => {
			mockFs.existsSync.mockReturnValue(false);

			expect(() => {
				FileSystemUtils.copyFile('/missing/source.txt', '/dest/file.txt');
			}).toThrow('Source file does not exist');
		});
	});

	describe('deleteFile', () => {
		it('should delete existing file', () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.unlinkSync.mockImplementation(() => undefined);

			FileSystemUtils.deleteFile('/path/to/file.txt');

			expect(mockFs.unlinkSync).toHaveBeenCalledWith('/path/to/file.txt');
		});

		it('should not throw error for non-existing file', () => {
			mockFs.existsSync.mockReturnValue(false);

			expect(() => {
				FileSystemUtils.deleteFile('/missing/file.txt');
			}).not.toThrow();

			expect(mockFs.unlinkSync).not.toHaveBeenCalled();
		});
	});

	describe('listFiles', () => {
		it('should list files in directory', () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readdirSync.mockReturnValue([
				'file1.txt',
				'file2.yaml',
				'subdir'
			] as any);
			mockFs.statSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				return {
					isFile: () => !pathStr.includes('subdir'),
					isDirectory: () => pathStr.includes('subdir')
				} as any;
			});

			const result = FileSystemUtils.listFiles('/path/to/dir');

			expect(result).toEqual([
				'/path/to/dir/file1.txt',
				'/path/to/dir/file2.yaml'
			]);
		});

		it('should return empty array for non-existing directory', () => {
			mockFs.existsSync.mockReturnValue(false);

			const result = FileSystemUtils.listFiles('/missing/dir');

			expect(result).toEqual([]);
		});

		it('should filter files by extension', () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readdirSync.mockReturnValue([
				'file1.txt',
				'file2.yaml',
				'file3.js'
			] as any);
			mockFs.statSync.mockReturnValue({
				isFile: () => true,
				isDirectory: () => false
			} as any);

			const result = FileSystemUtils.listFiles('/path/to/dir', '.yaml');

			expect(result).toEqual(['/path/to/dir/file2.yaml']);
		});
	});

	describe('getFileStats', () => {
		it('should return file statistics', () => {
			const mockStats = {
				size: 1024,
				mtime: new Date('2023-01-01'),
				isFile: () => true,
				isDirectory: () => false
			};
			mockFs.statSync.mockReturnValue(mockStats as any);

			const result = FileSystemUtils.getFileStats('/path/to/file.txt');

			expect(result).toEqual(mockStats);
		});

		it('should handle stat error', () => {
			mockFs.statSync.mockImplementation(() => {
				throw new Error('Permission denied');
			});

			expect(() => {
				FileSystemUtils.getFileStats('/restricted/file.txt');
			}).toThrow('Permission denied');
		});
	});
});
