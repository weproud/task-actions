import { YamlTemplate } from '../types';

export const TASK_INIT_TEMPLATE: YamlTemplate = {
	name: 'task-init.yaml',
	description: 'Initial task configuration for project setup',
	content: {
		version: 1,
		kind: 'task',
		id: 'init',
		name: 'Project Initialization',
		description: 'Initial setup and configuration for {{projectName}}',
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
		systemprompt: `Set up the project structure and initial configuration for development workflow.
		Consider project requirements, technology stack, and development environment setup.`,
		prompt: `Initialize {{projectName}} project with proper structure and configuration.

Please perform the following setup tasks:
1. Review project requirements and scope
2. Set up development environment and dependencies
3. Configure project structure and directories
4. Initialize version control and branching strategy
5. Set up testing framework and CI/CD pipeline
6. Configure development tools and linting rules
7. Create initial documentation and README

Ensure all configurations align with project goals and team development practices.`
	}
};
