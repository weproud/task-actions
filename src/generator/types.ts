// YAML 구조에 대한 TypeScript 인터페이스 정의

export interface BaseYamlConfig {
	version: number;
	name: string;
	description: string;
}

export interface ActionConfig extends BaseYamlConfig {
	kind: 'action';
	prompt: string;
}

export interface WorkflowConfig extends BaseYamlConfig {
	kind: 'workflow';
	jobs: {
		steps: WorkflowStep[];
	};
}

export interface WorkflowStep {
	name: string;
	uses?: string;
	prompt?: string;
}

export interface McpConfig extends BaseYamlConfig {
	kind: 'mcp';
	prompt: string;
}

export interface RuleConfig extends BaseYamlConfig {
	kind: 'rule';
	prompt: string;
}

export interface TaskConfig extends BaseYamlConfig {
	kind: 'task';
	id: number | string;
	status: 'todo' | 'in-progress' | 'done';
	jobs: {
		workflow: string;
		rules: string[];
		mcps: string[];
	};
	prompt: string;
}

export interface TasksConfig {
	version: number;
	name: string;
	description: string;
	tasks: Array<{
		id: string;
		status: 'todo' | 'in-progress' | 'done';
	}>;
}

export interface VarsConfig {
	slack_hook_url?: string;
	discord_hook_url?: string;
	github_token?: string;
	[key: string]: any;
}

// 템플릿 변수 타입 정의
export interface TemplateVariables {
	// 프로젝트 정보
	projectName: string;
	projectDescription: string;
	author: string;
	version: string;

	// Git 설정
	repositoryUrl?: string;
	branchPrefix?: string;

	// 환경 설정
	slackHookUrl?: string;
	discordHookUrl?: string;
	githubToken?: string;

	// 커스텀 설정
	[key: string]: any;
}

// 템플릿 타입
export type TemplateType =
	| 'action'
	| 'workflow'
	| 'mcp'
	| 'rule'
	| 'task'
	| 'tasks'
	| 'vars';

// 제너레이터 옵션
export interface GeneratorOptions {
	outputDir: string;
	templateDir: string;
	variables: TemplateVariables;
	overwrite?: boolean;
}

// 템플릿 메타데이터
export interface TemplateMetadata {
	type: TemplateType;
	name: string;
	description: string;
	templatePath: string;
	outputPath: string;
	requiredVariables: string[];
}

// 템플릿 설정 인터페이스
export interface TemplateConfig {
	template: any;
	filename: string;
	subdirectory?: string;
}

// 템플릿 그룹 설정
export interface TemplateGroup {
	type: TemplateType;
	displayName: string;
	subdirectory: string;
	templates: TemplateConfig[];
}

// 디렉토리 설정
export interface DirectoryConfig {
	name: string;
	path: string;
	required: boolean;
}

// 파일 생성 결과
export interface FileGenerationResult {
	path: string;
	success: boolean;
	skipped: boolean;
	error?: string;
}

// 생성 통계
export interface GenerationStats {
	totalFiles: number;
	createdFiles: number;
	skippedFiles: number;
	failedFiles: number;
	results: FileGenerationResult[];
}
