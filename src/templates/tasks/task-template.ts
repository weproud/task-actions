import { YamlTemplate } from '../types';

export const TASK_TEMPLATE: YamlTemplate = {
	name: 'tasks/task-template.yaml',
	description: '태스크 템플릿',
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
				'rules/development-rule.yaml'
			],
			mcps: [
				'mcps/sequential-thinking.yaml',
				'mcps/context7.yaml',
				'mcps/playwright.yaml'
			]
		},
		systemprompt: `주어진 요구사항을 분석하여 기능을 구현하고 테스트합니다. 
		기술 스택, 아키텍처, API 설계를 고려하여 개발하세요`,
		prompt: `<여기에 태스크 설명을 입력하세요>
		{{taskDescription}}`
	}
};
