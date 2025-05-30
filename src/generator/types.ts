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
	slack_webhook_url?: string;
	discord_webhook_url?: string;
	github_token?: string;
	[key: string]: string | number | boolean | undefined;
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
	slackWebhookUrl?: string;
	discordWebhookUrl?: string;
	githubToken?: string;

	// 태스크 관련 (옵셔널)
	taskId?: string;
	taskName?: string;
	taskDescription?: string;
	priority?: string;
	estimatedHours?: string;

	// 기타 설정
	testEnvironment?: string;
	complexityLevel?: string;

	// 커스텀 설정 (타입 제한)
	[key: string]: string | number | boolean | undefined;
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
export type GeneratorOptions = {
	outputDir: string;
	templateDir: string;
	variables: TemplateVariables;
	overwrite?: boolean;
};

// 템플릿 메타데이터
export interface TemplateMetadata {
	type: TemplateType;
	name: string;
	description: string;
	templatePath: string;
	outputPath: string;
	requiredVariables: string[];
}

// YAML 설정 유니온 타입
export type YamlConfigTypes =
	| ActionConfig
	| WorkflowConfig
	| McpConfig
	| RuleConfig
	| TaskConfig
	| TasksConfig
	| VarsConfig;

// 템플릿 설정 인터페이스 - YamlTemplate과 호환성 유지
export interface TemplateConfig {
	template: YamlConfigTypes | Record<string, unknown>;
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

// 성능 메트릭스 인터페이스 추가
export interface PerformanceMetrics {
	totalDuration: number;
	averageFileTime: number;
	slowestFile?: {
		path: string;
		duration: number;
	};
	fastestFile?: {
		path: string;
		duration: number;
	};
}

// 에러 정보 인터페이스
export interface ErrorInfo {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}
