// Project-related constants
export const PROJECT_CONSTANTS = {
	DEFAULT_VERSION: '1.0.0',
	DEFAULT_BRANCH_PREFIX: 'feature',
	DEFAULT_TEST_ENVIRONMENT: 'development',
	DEFAULT_COMPLEXITY_LEVEL: 'medium',
	DEFAULT_PRIORITY: 'medium',
	DEFAULT_ESTIMATED_HOURS: '4'
} as const;

// Time-related constants
export const TIME_CONSTANTS = {
	TIMESTAMP_FORMAT: 'yyyyMMddHHmmss',
	BACKUP_COUNTER_START: 1
} as const;

// Message-related constants
export const MESSAGES = {
	INIT: {
		STARTING: '🚀 Initializing Task Actions project...\n',
		SUCCESS: '✅ Project initialization completed!',
		ERROR: '❌ Error occurred during initialization:'
	},
	BACKUP: {
		SUCCESS: (dirName: string) =>
			`📦 Backed up existing .task-actions directory to ${dirName}.`,
		WARNING: (error: unknown) =>
			`⚠️  Error occurred while creating backup: ${error}`,
		ERROR: 'Failed to backup existing .task-actions directory.'
	},
	TASK: {
		SUCCESS: (filename: string) => `\n✅ Task file created: ${filename}`,
		NEXT_STEPS: '\n📝 Next steps:',
		STEP_1: '1. Edit the generated task file to write detailed requirements',
		STEP_2: (dir: string) => `2. Add the new task to ${dir}/tasks.yaml file`
	},
	STATUS: {
		NOT_INITIALIZED: '❌ Task Actions project is not initialized.',
		INIT_HINT: '💡 Initialize the project with `task-actions init` command.',
		INITIALIZED: '✅ Task Actions project is initialized.',
		DIRECTORY_STRUCTURE: '\n📁 Directory structure:'
	},
	CLEAN: {
		NOT_FOUND: '❌ No Task Actions project found to clean.',
		CONFIRMATION: (dir: string) => `🗑️  About to delete ${dir} directory.`,
		FORCE_HINT: 'Use --force option to force deletion.',
		PROGRESS: '🗑️  Deleting files...',
		SUCCESS: '✅ Project cleanup completed.'
	},
	GENERATION: {
		SUCCESS: (type: string) => `\n✅ ${type} file generation completed!`,
		ALL_SUCCESS: '\n✅ All YAML file generation completed!',
		ERROR: (type: string) => `❌ Error occurred while generating ${type} files:`
	},
	VALIDATION: {
		LOADING_WARNING:
			'Error occurred while reading vars.yaml file. Using default values.',
		REQUIRED_VARIABLES_MISSING: 'Required template variables are missing.',
		TEMPLATE_INVALID: 'Task template is invalid.',
		GENERATION_FAILED: 'Failed to generate task file.'
	}
} as const;

// URL-related defaults
export const DEFAULT_URLS = {
	SLACK_WEBHOOK: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
	DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
	GITHUB_TOKEN_PLACEHOLDER: 'YOUR_GITHUB_TOKEN',
	REPOSITORY_TEMPLATE: (author: string, projectName: string) =>
		`https://github.com/${author}/${projectName}.git`
} as const;

// File-related constants
export const FILE_CONSTANTS = {
	TASK_FILENAME_TEMPLATE: (taskId: string) => `task-${taskId}.yaml`,
	VARS_FILENAME: 'vars.yaml',
	TASKS_FILENAME: 'tasks.yaml'
} as const;

// Regular expression patterns (for YAML parsing)
export const YAML_PATTERNS = {
	PROJECT_NAME: /project:\s*\n\s*name:\s*(.+)/,
	PROJECT_AUTHOR: /project:\s*\n(?:.*\n)*?\s*author:\s*(.+)/,
	PROJECT_VERSION: /project:\s*\n(?:.*\n)*?\s*version:\s*(.+)/
} as const;
