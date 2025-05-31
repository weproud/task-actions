import { TemplateVariables } from '../../src/generator/types';

export const sampleVariables: TemplateVariables = {
	projectName: 'sample-project',
	projectDescription: 'A sample project for testing',
	author: 'Test Author',
	version: '1.0.0',
	slackWebhookUrl: 'https://hooks.slack.com/services/TEST/TEST/TEST',
	discordWebhookUrl: 'https://discord.com/api/webhooks/TEST/TEST'
};

export const minimalVariables: TemplateVariables = {
	projectName: 'minimal-project',
	projectDescription: 'Minimal project',
	author: 'Test',
	version: '1.0.0'
};

export const invalidVariables = {
	// 필수 필드 누락
	projectDescription: 'Missing project name',
	author: 'Test Author'
};
