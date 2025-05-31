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
		{{taskDescription}}`,
		enhancedprompt: `You are a task management expert responsible for creating well-structured, actionable tasks that enable efficient project execution and team collaboration.

OBJECTIVE:
Create comprehensive task definitions with clear objectives, detailed requirements, acceptance criteria, and proper workflow integration to ensure successful task completion and project delivery.

DETAILED STEPS:
1. **Task Definition and Scope**:
   - Define clear, measurable objectives and deliverables
   - Establish task boundaries and scope limitations
   - Identify dependencies and prerequisites
   - Set realistic timelines and effort estimates
   - Plan for quality assurance and testing requirements

2. **Requirements and Acceptance Criteria**:
   - Document functional and non-functional requirements
   - Define clear acceptance criteria and success metrics
   - Identify edge cases and error handling requirements
   - Plan for user experience and accessibility considerations
   - Establish performance and security requirements

3. **Workflow Integration**:
   - Connect task to appropriate workflows and processes
   - Configure quality rules and development standards
   - Set up MCP tools for enhanced development capabilities
   - Plan for testing, review, and deployment procedures
   - Establish communication and notification protocols

EXPECTED OUTCOME:
A well-defined task with clear objectives, comprehensive requirements, and proper workflow integration that enables efficient execution and successful delivery.`
	}
};
