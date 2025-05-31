import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// 핵심 함수들만 테스트
describe('Core Functions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Basic functionality', () => {
		it('should import core modules without errors', () => {
			// 모듈 import 테스트
			expect(() => {
				require('../src/core/constants');
			}).not.toThrow();
		});

		it('should have required constants', () => {
			const constants = require('../src/core/constants');
			expect(constants.MESSAGES).toBeDefined();
			expect(constants.PROJECT_CONSTANTS).toBeDefined();
			expect(constants.DEFAULT_URLS).toBeDefined();
		});
	});

	describe('Template engine', () => {
		it('should have template engine', () => {
			const { TemplateEngine } = require('../src/generator/template-engine');
			expect(TemplateEngine).toBeDefined();
			expect(typeof TemplateEngine.processTemplate).toBe('function');
		});

		it('should process simple template', () => {
			const { TemplateEngine } = require('../src/generator/template-engine');
			const template = 'Hello {{name}}!';
			const variables = { name: 'World' };
			const result = TemplateEngine.processTemplate(template, variables);
			expect(result).toBe('Hello World!');
		});
	});
});
