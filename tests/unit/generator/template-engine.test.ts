import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as fs from 'fs';
import { TemplateEngine } from '../../../src/generator/template-engine';
import { sampleVariables } from '../../fixtures/sample-variables';

// fs 모듈 모킹
jest.mock('fs', () => ({
	existsSync: jest.fn(),
	readFileSync: jest.fn(),
	writeFileSync: jest.fn(),
	mkdirSync: jest.fn()
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('TemplateEngine', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('render', () => {
		it('should replace template variables', () => {
			const template = 'Hello {{projectName}}, created by {{author}}!';
			const result = TemplateEngine.render(template, sampleVariables);

			expect(result).toBe('Hello sample-project, created by Test Author!');
		});

		it('should handle nested object properties', () => {
			const template = 'Project: {{projectName}}, Author: {{author}}';
			const result = TemplateEngine.render(template, sampleVariables);
			expect(result).toBe('Project: sample-project, Author: Test Author');
		});

		it('should handle missing variables gracefully', () => {
			const template = 'Hello {{projectName}}, missing: {{missingVar}}';
			const result = TemplateEngine.render(template, sampleVariables);

			expect(result).toBe('Hello sample-project, missing: {{missingVar}}');
		});

		it('should handle whitespace in variable names', () => {
			const template = 'Hello {{ projectName }}, by {{ author }}';
			const result = TemplateEngine.render(template, sampleVariables);

			expect(result).toBe('Hello sample-project, by Test Author');
		});

		it('should handle multiple occurrences of same variable', () => {
			const template = '{{projectName}} - {{projectName}} by {{projectName}}';
			const result = TemplateEngine.render(template, sampleVariables);

			expect(result).toBe('sample-project - sample-project by sample-project');
		});

		it('should throw error for empty template', () => {
			expect(() => {
				TemplateEngine.render('', sampleVariables);
			}).toThrow('템플릿이 제공되지 않았습니다');
		});

		it('should throw error for missing variables', () => {
			expect(() => {
				TemplateEngine.render('Hello {{name}}', null as any);
			}).toThrow('템플릿 변수가 제공되지 않았습니다');
		});
	});

	describe('extractVariables', () => {
		it('should extract variables from template', () => {
			const template = 'Hello {{name}}, welcome to {{projectName}}!';
			const variables = TemplateEngine.extractVariables(template);
			expect(variables).toContain('name');
			expect(variables).toContain('projectName');
			expect(variables).toHaveLength(2);
		});

		it('should handle empty template', () => {
			const variables = TemplateEngine.extractVariables('');
			expect(variables).toHaveLength(0);
		});
	});

	describe('renderFile', () => {
		it('should render template file', () => {
			const templateContent = 'Project: {{projectName}}\nAuthor: {{author}}';
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readFileSync.mockReturnValue(templateContent);

			const result = TemplateEngine.renderFile(
				'/path/to/template.txt',
				sampleVariables
			);

			expect(result).toBe('Project: sample-project\nAuthor: Test Author');
			expect(mockFs.readFileSync).toHaveBeenCalledWith(
				'/path/to/template.txt',
				'utf8'
			);
		});

		it('should throw error for missing template file', () => {
			mockFs.existsSync.mockReturnValue(false);

			expect(() => {
				TemplateEngine.renderFile('/missing/template.txt', sampleVariables);
			}).toThrow('Template file not found');
		});

		it('should throw error for empty template path', () => {
			expect(() => {
				TemplateEngine.renderFile('', sampleVariables);
			}).toThrow('Template file path not provided');
		});

		it('should handle file read error', () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readFileSync.mockImplementation(() => {
				throw new Error('Permission denied');
			});

			expect(() => {
				TemplateEngine.renderFile('/path/to/template.txt', sampleVariables);
			}).toThrow('Template file reading failed');
		});
	});

	describe('renderToFile', () => {
		it('should render template to output file', () => {
			const templateContent = 'Project: {{projectName}}';
			mockFs.existsSync.mockImplementation((path: any) => {
				return path.toString().includes('template.txt');
			});
			mockFs.readFileSync.mockReturnValue(templateContent);
			mockFs.writeFileSync.mockImplementation(() => undefined);
			mockFs.mkdirSync.mockImplementation(() => undefined);

			TemplateEngine.renderToFile(
				'/path/to/template.txt',
				'/output/result.txt',
				sampleVariables
			);

			expect(mockFs.writeFileSync).toHaveBeenCalledWith(
				'/output/result.txt',
				'Project: sample-project',
				'utf8'
			);
		});

		it('should create output directory if not exists', () => {
			mockFs.existsSync.mockImplementation((path: any) => {
				const pathStr = path.toString();
				return pathStr.includes('template.txt') && !pathStr.includes('output');
			});
			mockFs.readFileSync.mockReturnValue('{{projectName}}');
			mockFs.writeFileSync.mockImplementation(() => undefined);
			mockFs.mkdirSync.mockImplementation(() => undefined);

			TemplateEngine.renderToFile(
				'/path/to/template.txt',
				'/output/dir/result.txt',
				sampleVariables
			);

			expect(mockFs.mkdirSync).toHaveBeenCalledWith('/output/dir', {
				recursive: true
			});
		});

		it('should skip existing file when overwrite is false', () => {
			mockFs.existsSync.mockReturnValue(true);

			TemplateEngine.renderToFile(
				'/path/to/template.txt',
				'/output/existing.txt',
				sampleVariables,
				false
			);

			expect(mockFs.writeFileSync).not.toHaveBeenCalled();
		});

		it('should overwrite existing file when overwrite is true', () => {
			mockFs.existsSync.mockReturnValue(true);
			mockFs.readFileSync.mockReturnValue('{{projectName}}');
			mockFs.writeFileSync.mockImplementation(() => undefined);

			TemplateEngine.renderToFile(
				'/path/to/template.txt',
				'/output/existing.txt',
				sampleVariables,
				true
			);

			expect(mockFs.writeFileSync).toHaveBeenCalled();
		});
	});
});
