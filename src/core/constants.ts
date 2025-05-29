// 프로젝트 관련 상수
export const PROJECT_CONSTANTS = {
	DEFAULT_VERSION: '1.0.0',
	DEFAULT_BRANCH_PREFIX: 'feature',
	DEFAULT_TEST_ENVIRONMENT: 'development',
	DEFAULT_COMPLEXITY_LEVEL: 'medium',
	DEFAULT_PRIORITY: 'medium',
	DEFAULT_ESTIMATED_HOURS: '4'
} as const;

// 시간 관련 상수
export const TIME_CONSTANTS = {
	TIMESTAMP_FORMAT: 'yyyyMMddHHmmss',
	BACKUP_COUNTER_START: 1
} as const;

// 메시지 관련 상수
export const MESSAGES = {
	INIT: {
		STARTING: '🚀 Task Actions 프로젝트를 초기화합니다...\n',
		SUCCESS: '✅ 프로젝트 초기화가 완료되었습니다!',
		ERROR: '❌ 초기화 중 오류가 발생했습니다:'
	},
	BACKUP: {
		SUCCESS: (dirName: string) =>
			`📦 기존 .task-actions 디렉토리를 ${dirName}으로 백업했습니다.`,
		WARNING: (error: unknown) =>
			`⚠️  백업 생성 중 오류가 발생했습니다: ${error}`,
		ERROR: '기존 .task-actions 디렉토리 백업에 실패했습니다.'
	},
	TASK: {
		SUCCESS: (filename: string) =>
			`\n✅ 태스크 파일이 생성되었습니다: ${filename}`,
		NEXT_STEPS: '\n📝 다음 단계:',
		STEP_1: '1. 생성된 태스크 파일을 편집하여 요구사항을 상세히 작성하세요',
		STEP_2: (dir: string) =>
			`2. ${dir}/tasks.yaml 파일에 새 태스크를 추가하세요`
	},
	STATUS: {
		NOT_INITIALIZED: '❌ Task Actions 프로젝트가 초기화되지 않았습니다.',
		INIT_HINT: '💡 `task-actions init` 명령어로 프로젝트를 초기화하세요.',
		INITIALIZED: '✅ Task Actions 프로젝트가 초기화되어 있습니다.',
		DIRECTORY_STRUCTURE: '\n📁 디렉토리 구조:'
	},
	CLEAN: {
		NOT_FOUND: '❌ 정리할 Task Actions 프로젝트를 찾을 수 없습니다.',
		CONFIRMATION: (dir: string) => `🗑️  ${dir} 디렉토리를 삭제하려고 합니다.`,
		FORCE_HINT: '강제 삭제하려면 --force 옵션을 사용하세요.',
		PROGRESS: '🗑️  파일들을 삭제합니다...',
		SUCCESS: '✅ 프로젝트 정리가 완료되었습니다.'
	},
	GENERATION: {
		SUCCESS: (type: string) => `\n✅ ${type} 파일 생성 완료!`,
		ALL_SUCCESS: '\n✅ 모든 YAML 파일 생성이 완료되었습니다!',
		ERROR: (type: string) => `❌ ${type} 파일 생성 중 오류가 발생했습니다:`
	},
	VALIDATION: {
		LOADING_WARNING:
			'vars.yaml 파일을 읽는 중 오류가 발생했습니다. 기본값을 사용합니다.',
		REQUIRED_VARIABLES_MISSING: '필수 템플릿 변수가 누락되었습니다.',
		TEMPLATE_INVALID: '태스크 템플릿이 유효하지 않습니다.',
		GENERATION_FAILED: '태스크 파일 생성에 실패했습니다.'
	}
} as const;

// URL 관련 기본값
export const DEFAULT_URLS = {
	SLACK_WEBHOOK: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
	DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
	GITHUB_TOKEN_PLACEHOLDER: 'YOUR_GITHUB_TOKEN',
	REPOSITORY_TEMPLATE: (author: string, projectName: string) =>
		`https://github.com/${author}/${projectName}.git`
} as const;

// 파일 관련 상수
export const FILE_CONSTANTS = {
	TASK_FILENAME_TEMPLATE: (taskId: string) => `task-${taskId}.yaml`,
	VARS_FILENAME: 'vars.yaml',
	TASKS_FILENAME: 'tasks.yaml'
} as const;

// 정규식 패턴 (YAML 파싱용)
export const YAML_PATTERNS = {
	PROJECT_NAME: /project:\s*\n\s*name:\s*(.+)/,
	PROJECT_AUTHOR: /project:\s*\n(?:.*\n)*?\s*author:\s*(.+)/,
	PROJECT_VERSION: /project:\s*\n(?:.*\n)*?\s*version:\s*(.+)/
} as const;
