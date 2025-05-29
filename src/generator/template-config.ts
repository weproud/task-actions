import { TemplateGroup, DirectoryConfig } from './types';

// 템플릿 imports
import * as actionsTemplates from '../templates/actions';
import * as workflowsTemplates from '../templates/workflows';
import * as mcpsTemplates from '../templates/mcps';
import * as rulesTemplates from '../templates/rules';
import * as baseTemplates from '../templates/base';
import * as tasksTemplates from '../templates/tasks';

// task-actions 디렉토리 상수
export const TASK_ACTIONS_DIR = '.task-actions';

// 디렉토리 설정
export const DIRECTORY_CONFIG: DirectoryConfig[] = [
	{ name: TASK_ACTIONS_DIR, path: TASK_ACTIONS_DIR, required: true },
	{ name: 'actions', path: `${TASK_ACTIONS_DIR}/actions`, required: true },
	{ name: 'workflows', path: `${TASK_ACTIONS_DIR}/workflows`, required: true },
	{ name: 'mcps', path: `${TASK_ACTIONS_DIR}/mcps`, required: true },
	{ name: 'rules', path: `${TASK_ACTIONS_DIR}/rules`, required: true }
];

// 템플릿 그룹 설정
export const TEMPLATE_GROUPS: TemplateGroup[] = [
	{
		type: 'action',
		displayName: '액션',
		subdirectory: 'actions',
		templates: [
			{
				template: actionsTemplates.CREATE_BRANCH_ACTION_TEMPLATE,
				filename: 'create-branch.yaml'
			},
			{
				template: actionsTemplates.DEVELOPMENT_ACTION_TEMPLATE,
				filename: 'development.yaml'
			},
			{
				template: actionsTemplates.GIT_COMMIT_ACTION_TEMPLATE,
				filename: 'git-commit.yaml'
			},
			{
				template: actionsTemplates.GIT_PUSH_ACTION_TEMPLATE,
				filename: 'git-push.yaml'
			},
			{
				template: actionsTemplates.CREATE_PULL_REQUEST_ACTION_TEMPLATE,
				filename: 'create-pull-request.yaml'
			},
			{
				template: actionsTemplates.TASK_DONE_ACTION_TEMPLATE,
				filename: 'task-done.yaml'
			}
		]
	},
	{
		type: 'workflow',
		displayName: '워크플로우',
		subdirectory: 'workflows',
		templates: [
			{
				template: workflowsTemplates.FEATURE_DEVELOPMENT_WORKFLOW_TEMPLATE,
				filename: 'feature-development.yaml'
			}
		]
	},
	{
		type: 'mcp',
		displayName: 'MCP',
		subdirectory: 'mcps',
		templates: [
			{
				template: mcpsTemplates.CONTEXT7_MCP_TEMPLATE,
				filename: 'context7.yaml'
			},
			{
				template: mcpsTemplates.PLAYWRIGHT_MCP_TEMPLATE,
				filename: 'playwright.yaml'
			},
			{
				template: mcpsTemplates.SEQUENTIAL_THINKING_MCP_TEMPLATE,
				filename: 'sequential-thinking.yaml'
			}
		]
	},
	{
		type: 'rule',
		displayName: '규칙',
		subdirectory: 'rules',
		templates: [
			{
				template: rulesTemplates.DEVELOPMENT_RULE_TEMPLATE,
				filename: 'development-rule.yaml'
			}
		]
	},
	{
		type: 'vars',
		displayName: '기본 설정',
		subdirectory: '',
		templates: [
			{
				template: baseTemplates.TASKS_BASE_TEMPLATE,
				filename: 'tasks.yaml'
			},
			{
				template: baseTemplates.VARS_BASE_TEMPLATE,
				filename: 'vars.yaml'
			}
		]
	}
];

// 태스크 템플릿 (특별 처리)
export const TASK_TEMPLATE = tasksTemplates.TASK_TEMPLATE;

/**
 * 템플릿 타입으로 템플릿 그룹 찾기
 */
export function getTemplateGroup(type: string): TemplateGroup | undefined {
	return TEMPLATE_GROUPS.find((group) => group.type === type);
}

/**
 * 모든 템플릿 그룹 가져오기
 */
export function getAllTemplateGroups(): TemplateGroup[] {
	return TEMPLATE_GROUPS;
}

/**
 * 디렉토리 설정 가져오기
 */
export function getDirectoryConfig(): DirectoryConfig[] {
	return DIRECTORY_CONFIG;
}
