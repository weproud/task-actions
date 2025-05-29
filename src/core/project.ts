import * as fs from 'fs';
import * as path from 'path';
import {
	YamlGenerator,
	FileSystemUtils,
	TemplateProcessor,
	TASK_ACTIONS_DIR,
	TemplateType,
	TemplateVariables,
	GenerateTaskOptions
} from '../generator';
import {
	getDefaultProjectName,
	getDefaultAuthor,
	printDirectoryTree
} from './utils';
import { ProjectStatus, CleanOptions, StatusOptions } from './types';
import {
	PROJECT_CONSTANTS,
	MESSAGES,
	DEFAULT_URLS,
	FILE_CONSTANTS,
	TIME_CONSTANTS
} from './constants';
import { YamlParser } from './yaml-parser';
import { ErrorHandler } from './error-handler';

/**
 * 기본 프로젝트 변수 수집
 */
export async function collectDefaultVariables(): Promise<TemplateVariables> {
	const projectName = getDefaultProjectName();
	const author = getDefaultAuthor();
	const description = `${projectName} 프로젝트`;

	return {
		projectName,
		projectDescription: description,
		author,
		version: PROJECT_CONSTANTS.DEFAULT_VERSION,
		branchPrefix: PROJECT_CONSTANTS.DEFAULT_BRANCH_PREFIX,
		slackHookUrl: DEFAULT_URLS.SLACK_WEBHOOK,
		discordHookUrl: DEFAULT_URLS.DISCORD_WEBHOOK,
		githubToken: DEFAULT_URLS.GITHUB_TOKEN_PLACEHOLDER,
		repositoryUrl: DEFAULT_URLS.REPOSITORY_TEMPLATE(author, projectName),
		testEnvironment: PROJECT_CONSTANTS.DEFAULT_TEST_ENVIRONMENT,
		complexityLevel: PROJECT_CONSTANTS.DEFAULT_COMPLEXITY_LEVEL
	};
}

/**
 * 제너레이터를 사용하여 프로젝트 파일들 생성
 */
export async function generateProjectFiles(
	outputDir: string,
	variables: TemplateVariables
): Promise<void> {
	const templateDir = path.join(__dirname, '../templates');

	// 변수 검증
	if (!TemplateProcessor.validateVariables(variables)) {
		throw new Error(MESSAGES.VALIDATION.REQUIRED_VARIABLES_MISSING);
	}

	const generator = new YamlGenerator({
		outputDir,
		templateDir,
		variables,
		overwrite: false
	});

	const stats = await generator.generateAll();
	TemplateProcessor.printStats(stats);
}

/**
 * 백업 디렉토리 이름 생성
 */
function createBackupDirName(baseName: string): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hour = String(now.getHours()).padStart(2, '0');
	const minute = String(now.getMinutes()).padStart(2, '0');
	const second = String(now.getSeconds()).padStart(2, '0');

	return `${baseName}-${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * 고유한 백업 경로 찾기
 */
function findUniqueBackupPath(
	currentDir: string,
	baseBackupName: string
): string {
	let backupPath = path.join(currentDir, baseBackupName);
	let counter = TIME_CONSTANTS.BACKUP_COUNTER_START;

	while (FileSystemUtils.fileExists(backupPath)) {
		const numberedBackupName = `${baseBackupName}-${counter}`;
		backupPath = path.join(currentDir, numberedBackupName);
		counter++;
	}

	return backupPath;
}

/**
 * 기존 .task-actions 디렉토리 백업
 */
async function backupExistingTaskActionsDir(currentDir: string): Promise<void> {
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		return; // 백업할 디렉토리가 없음
	}

	const baseBackupName = createBackupDirName(TASK_ACTIONS_DIR);
	const backupPath = findUniqueBackupPath(currentDir, baseBackupName);
	const backupDirName = path.basename(backupPath);

	try {
		fs.renameSync(taskActionsPath, backupPath);
		console.log(MESSAGES.BACKUP.SUCCESS(backupDirName));
	} catch (error) {
		console.warn(MESSAGES.BACKUP.WARNING(error));
		throw new Error(MESSAGES.BACKUP.ERROR);
	}
}

/**
 * 프로젝트 초기화
 */
export async function initProject(): Promise<void> {
	const currentDir = process.cwd();

	// 기존 .task-actions 디렉토리가 있으면 백업
	await backupExistingTaskActionsDir(currentDir);

	const variables = await collectDefaultVariables();
	await generateProjectFiles(currentDir, variables);
}

/**
 * 특정 타입의 파일들 생성
 */
export async function generateByType(type: TemplateType): Promise<void> {
	const currentDir = process.cwd();
	const variables = await loadExistingVariables();

	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, '../templates'),
		variables,
		overwrite: false
	});

	const stats = await generator.generateByType(type);
	console.log(MESSAGES.GENERATION.SUCCESS(type));
}

/**
 * 새로운 태스크 파일 생성
 */
export async function generateTask(
	taskId: string,
	taskName?: string,
	options?: GenerateTaskOptions
): Promise<void> {
	const currentDir = process.cwd();
	const variables = await loadExistingVariables();

	// 기본값 설정
	const finalTaskName = taskName || `Task ${taskId}`;
	const finalDescription =
		options?.description || `${finalTaskName}에 대한 상세한 설명을 입력하세요.`;
	const priority = options?.priority || PROJECT_CONSTANTS.DEFAULT_PRIORITY;
	const estimatedHours =
		options?.estimatedHours || PROJECT_CONSTANTS.DEFAULT_ESTIMATED_HOURS;

	// 태스크별 추가 변수 설정
	const taskVariables: TemplateVariables = {
		...variables,
		taskId,
		taskName: finalTaskName,
		taskDescription: finalDescription,
		priority,
		estimatedHours
	};

	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, '../templates'),
		variables: taskVariables,
		overwrite: false
	});

	await generator.generateTask(taskId, finalTaskName, finalDescription);

	const filename = path.join(
		TASK_ACTIONS_DIR,
		FILE_CONSTANTS.TASK_FILENAME_TEMPLATE(taskId)
	);
	console.log(MESSAGES.TASK.SUCCESS(filename));
	console.log(MESSAGES.TASK.NEXT_STEPS);
	console.log(MESSAGES.TASK.STEP_1);
	console.log(MESSAGES.TASK.STEP_2(TASK_ACTIONS_DIR));
}

/**
 * 기본 변수 생성
 */
function createDefaultVariables(): TemplateVariables {
	return {
		projectName: getDefaultProjectName(),
		projectDescription: 'My Project',
		author: getDefaultAuthor(),
		version: PROJECT_CONSTANTS.DEFAULT_VERSION,
		branchPrefix: PROJECT_CONSTANTS.DEFAULT_BRANCH_PREFIX,
		testEnvironment: PROJECT_CONSTANTS.DEFAULT_TEST_ENVIRONMENT,
		complexityLevel: PROJECT_CONSTANTS.DEFAULT_COMPLEXITY_LEVEL
	};
}

/**
 * 기존 변수 로드 (개선된 YAML 파싱 사용)
 */
export async function loadExistingVariables(): Promise<TemplateVariables> {
	const currentDir = process.cwd();
	const varsPath = path.join(
		currentDir,
		TASK_ACTIONS_DIR,
		FILE_CONSTANTS.VARS_FILENAME
	);

	// 기본 변수 설정
	const defaultVariables = createDefaultVariables();

	// vars.yaml이 존재하면 로드
	const loadedVariables = await YamlParser.loadVarsFromFile(varsPath);

	if (loadedVariables) {
		// 로드된 변수와 기본 변수 병합
		return { ...defaultVariables, ...loadedVariables };
	}

	return defaultVariables;
}

/**
 * 프로젝트 상태 확인
 */
export async function checkProjectStatus(
	options?: StatusOptions
): Promise<ProjectStatus> {
	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	console.log('📊 프로젝트 상태:\n');

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		console.log(MESSAGES.STATUS.NOT_INITIALIZED);
		console.log(MESSAGES.STATUS.INIT_HINT);
		return {
			isInitialized: false,
			hasRequiredFiles: false,
			missingFiles: []
		};
	}

	console.log(MESSAGES.STATUS.INITIALIZED);

	const variables = await loadExistingVariables();
	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, '../templates'),
		variables,
		overwrite: false
	});

	const stats = await generator.getGenerationStats();
	TemplateProcessor.printStats(stats);

	if (options?.detailed) {
		console.log(MESSAGES.STATUS.DIRECTORY_STRUCTURE);
		printDirectoryTree(taskActionsPath);
	}

	return {
		isInitialized: true,
		hasRequiredFiles: true,
		missingFiles: [],
		variables
	};
}

/**
 * 프로젝트 정리
 */
export async function cleanProject(options: CleanOptions): Promise<void> {
	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		console.log(MESSAGES.CLEAN.NOT_FOUND);
		return;
	}

	if (!options.force) {
		console.log(MESSAGES.CLEAN.CONFIRMATION(TASK_ACTIONS_DIR));
		console.log(MESSAGES.CLEAN.FORCE_HINT);
		return;
	}

	console.log(MESSAGES.CLEAN.PROGRESS);
	fs.rmSync(taskActionsPath, { recursive: true, force: true });

	console.log(MESSAGES.CLEAN.SUCCESS);
}
