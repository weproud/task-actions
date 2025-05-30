// 프로젝트 관련 기능들
export {
	checkProjectStatus,
	cleanProject,
	collectDefaultVariables,
	generateByType,
	generateProjectFiles,
	generateTask,
	initProject,
	loadExistingVariables
} from './project';

// 검증 관련 기능들
export { validateProject, validateYamlFiles } from './validation';

// 템플릿 관련 기능들
export { listTemplates } from './templates';

// 유틸리티 함수들
export {
	getDefaultAuthor,
	getDefaultProjectName,
	groupBy,
	notifyProjectInit,
	notifyProjectInitDiscord,
	notifyTaskCompletion,
	notifyTaskCompletionDiscord,
	printDirectoryTree,
	printNextSteps,
	sendDiscordMessage,
	sendSlackMessage
} from './utils';

// 타입 정의들
export type {
	CleanOptions,
	ProjectStatus,
	StatusOptions,
	ValidationResult
} from './types';

export type { ListTemplatesOptions } from './templates';

export { completeTask, showTask, startTask } from './task';

// 새로운 유틸리티 모듈들
export {
	DEFAULT_URLS,
	FILE_CONSTANTS,
	MESSAGES,
	PROJECT_CONSTANTS,
	TIME_CONSTANTS,
	YAML_PATTERNS
} from './constants';
export { ErrorHandler } from './error-handler';
export { YamlParser } from './yaml-parser';
export { PackageJsonReader } from './package-json-reader';
export { GeneratorFactory } from './generator-factory';
