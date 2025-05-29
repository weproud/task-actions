import * as fs from 'fs';
import * as path from 'path';
import {
	YamlGenerator,
	FileSystemUtils,
	TemplateProcessor,
	TASK_ACTIONS_DIR,
	TemplateType,
	TemplateVariables
} from '../generator';
import {
	getDefaultProjectName,
	getDefaultAuthor,
	printDirectoryTree
} from './utils';
import { ProjectStatus, CleanOptions, StatusOptions } from './types';

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
		version: '1.0.0',
		branchPrefix: 'feature',
		slackHookUrl: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
		discordHookUrl: 'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
		githubToken: 'YOUR_GITHUB_TOKEN',
		repositoryUrl: `https://github.com/${author}/${projectName}.git`,
		testEnvironment: 'development',
		complexityLevel: 'medium'
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
		throw new Error('필수 템플릿 변수가 누락되었습니다.');
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
 * 기존 .task-actions 디렉토리 백업
 */
async function backupExistingTaskActionsDir(currentDir: string): Promise<void> {
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		return; // 백업할 디렉토리가 없음
	}

	// 현재 시간을 yyyyMMddHHmmss 형식으로 포맷 (초 추가)
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hour = String(now.getHours()).padStart(2, '0');
	const minute = String(now.getMinutes()).padStart(2, '0');
	const second = String(now.getSeconds()).padStart(2, '0');
	const timestamp = `${year}${month}${day}${hour}${minute}${second}`;

	let backupDirName = `${TASK_ACTIONS_DIR}-${timestamp}`;
	let backupPath = path.join(currentDir, backupDirName);
	let counter = 1;

	// 동일한 이름의 백업 디렉토리가 있으면 증분 번호 추가
	while (FileSystemUtils.fileExists(backupPath)) {
		backupDirName = `${TASK_ACTIONS_DIR}-${timestamp}-${counter}`;
		backupPath = path.join(currentDir, backupDirName);
		counter++;
	}

	try {
		// 기존 디렉토리를 백업 디렉토리로 이름 변경
		fs.renameSync(taskActionsPath, backupPath);
		console.log(
			`📦 기존 ${TASK_ACTIONS_DIR} 디렉토리를 ${backupDirName}으로 백업했습니다.`
		);
	} catch (error) {
		console.warn(`⚠️  백업 생성 중 오류가 발생했습니다: ${error}`);
		throw new Error(`기존 ${TASK_ACTIONS_DIR} 디렉토리 백업에 실패했습니다.`);
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
	console.log(`\n✅ ${type} 파일 생성 완료!`);
}

/**
 * 새로운 태스크 파일 생성
 */
export async function generateTask(
	taskId: string,
	taskName?: string,
	options?: any
): Promise<void> {
	const currentDir = process.cwd();
	const variables = await loadExistingVariables();

	// 기본값 설정
	const finalTaskName = taskName || `Task ${taskId}`;
	const finalDescription =
		options?.description || `${finalTaskName}에 대한 상세한 설명을 입력하세요.`;

	// 태스크별 추가 변수 설정
	const taskVariables: TemplateVariables = {
		...variables,
		taskId,
		taskName: finalTaskName,
		taskDescription: finalDescription
	};

	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, '../templates'),
		variables: taskVariables,
		overwrite: false
	});

	await generator.generateTask(taskId, finalTaskName, finalDescription);

	console.log(
		`\n✅ 태스크 파일이 생성되었습니다: ${TASK_ACTIONS_DIR}/task-${taskId}.yaml`
	);
	console.log('\n📝 다음 단계:');
	console.log('1. 생성된 태스크 파일을 편집하여 요구사항을 상세히 작성하세요');
	console.log(
		`2. ${TASK_ACTIONS_DIR}/tasks.yaml 파일에 새 태스크를 추가하세요`
	);
}

/**
 * 기존 변수 로드
 */
export async function loadExistingVariables(): Promise<TemplateVariables> {
	const currentDir = process.cwd();
	const varsPath = path.join(currentDir, TASK_ACTIONS_DIR, 'vars.yaml');

	// 기본 변수 설정
	let variables: TemplateVariables = {
		projectName: getDefaultProjectName(),
		projectDescription: 'My Project',
		author: getDefaultAuthor(),
		version: '1.0.0',
		branchPrefix: 'feature',
		testEnvironment: 'development',
		complexityLevel: 'medium'
	};

	// vars.yaml이 존재하면 로드 (간단한 파싱)
	if (FileSystemUtils.fileExists(varsPath)) {
		try {
			const varsContent = FileSystemUtils.readFile(varsPath);

			// 간단한 YAML 파싱 (실제 프로젝트에서는 yaml 라이브러리 사용 권장)
			const matches = {
				projectName: varsContent.match(/project:\s*\n\s*name:\s*(.+)/),
				author: varsContent.match(/project:\s*\n(?:.*\n)*?\s*author:\s*(.+)/),
				version: varsContent.match(/project:\s*\n(?:.*\n)*?\s*version:\s*(.+)/)
			};

			if (matches.projectName)
				variables.projectName = matches.projectName[1].trim();
			if (matches.author) variables.author = matches.author[1].trim();
			if (matches.version) variables.version = matches.version[1].trim();
		} catch (error) {
			console.warn(
				'vars.yaml 파일을 읽는 중 오류가 발생했습니다. 기본값을 사용합니다.'
			);
		}
	}

	return variables;
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
		console.log('❌ Task Actions 프로젝트가 초기화되지 않았습니다.');
		console.log('💡 `task-actions init` 명령어로 프로젝트를 초기화하세요.');
		return {
			isInitialized: false,
			hasRequiredFiles: false,
			missingFiles: []
		};
	}

	console.log('✅ Task Actions 프로젝트가 초기화되어 있습니다.');

	const variables = await loadExistingVariables();
	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, '../templates'),
		variables,
		overwrite: false
	});

	const stats = generator.getGenerationStats();
	TemplateProcessor.printStats(stats);

	if (options?.detailed) {
		console.log('\n📁 디렉토리 구조:');
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
		console.log('❌ 정리할 Task Actions 프로젝트를 찾을 수 없습니다.');
		return;
	}

	if (!options.force) {
		console.log(`🗑️  ${TASK_ACTIONS_DIR} 디렉토리를 삭제하려고 합니다.`);
		console.log('강제 삭제하려면 --force 옵션을 사용하세요.');
		return;
	}

	console.log('🗑️  파일들을 삭제합니다...');
	fs.rmSync(taskActionsPath, { recursive: true, force: true });

	console.log('✅ 프로젝트 정리가 완료되었습니다.');
}
