// 프로젝트 관련 기능들
export {
	initProject,
	generateByType,
	generateTask,
	generateProjectFiles,
	collectDefaultVariables,
	loadExistingVariables,
	checkProjectStatus,
	cleanProject
} from './project';

// 검증 관련 기능들
export { validateProject, validateYamlFiles } from './validation';

// 템플릿 관련 기능들
export { listTemplates } from './templates';

// 유틸리티 함수들
export {
	getDefaultProjectName,
	getDefaultAuthor,
	printDirectoryTree,
	printNextSteps,
	groupBy,
	sendSlackMessage,
	sendDiscordMessage,
	notifyTaskCompletion,
	notifyTaskCompletionDiscord,
	notifyProjectInit,
	notifyProjectInitDiscord
} from './utils';

// 타입 정의들
export type {
	ProjectStatus,
	ValidationResult,
	CleanOptions,
	StatusOptions
} from './types';

export type { ListTemplatesOptions } from './templates';

export { startTask, completeTask } from './task';

// 새로운 유틸리티 모듈들
export { ErrorHandler } from './error-handler';
export { YamlParser } from './yaml-parser';
export {
	PROJECT_CONSTANTS,
	MESSAGES,
	DEFAULT_URLS,
	FILE_CONSTANTS,
	TIME_CONSTANTS,
	YAML_PATTERNS
} from './constants';
