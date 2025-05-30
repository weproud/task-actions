import { YamlTemplate } from '../types';

export const TASK_TEMPLATE: YamlTemplate = {
	name: 'tasks/task-template.yaml',
	description: 'Task template',
	content: {
		version: 1,
		kind: 'task',
		id: '{{taskId}}',
		name: '{{taskName}}',
		description: '{{taskDescription}}',
		status: 'todo',
		jobs: {
			workflow: 'workflows/feature-development.yaml',
			rules: [
				'rules/the-must-follow-rule.yaml',
				'rules/development-rule.yaml',
				'rules/refactoring-rule.yaml'
			],
			mcps: [
				'mcps/sequential-thinking.yaml',
				'mcps/context7.yaml',
				'mcps/playwright.yaml'
			]
		},
		systemprompt: `Analyze the given requirements to implement and test features.
		Consider technology stack, architecture, and API design for development`,
		prompt: `<Enter task description here>
		{{taskDescription}}`
	}
};
