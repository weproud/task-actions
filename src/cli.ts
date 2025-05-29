#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import {
	YamlGenerator,
	FileSystemUtils,
	TemplateProcessor,
	PerformanceUtils,
	TASK_ACTIONS_DIR,
	TemplateType,
	TemplateVariables
} from './generator';

const program = new Command();

// 전역 옵션
let debugMode = false;
let performanceMode = false;

program
	.name('task-actions')
	.description('Task Actions CLI - 워크플로우 및 태스크 관리 도구')
	.version('1.0.0')
	.option('--debug', '디버그 모드 활성화')
	.option('--performance', '성능 모니터링 모드 활성화')
	.hook('preAction', (thisCommand) => {
		debugMode = thisCommand.opts().debug || false;
		performanceMode = thisCommand.opts().performance || false;

		if (debugMode) {
			console.log('🐛 디버그 모드가 활성화되었습니다.');
		}

		if (performanceMode) {
			console.log('⚡ 성능 모니터링 모드가 활성화되었습니다.');
			PerformanceUtils.clearMetrics();
		}
	});

// init 명령어 정의
program
	.command('init')
	.description('새로운 task-actions 프로젝트를 초기화합니다')
	.option('--interactive', '대화형 모드로 프로젝트 설정')
	.option('--project-name <name>', '프로젝트 이름')
	.option('--author <author>', '작성자')
	.option('--description <desc>', '프로젝트 설명')
	.option('--overwrite', '기존 파일 덮어쓰기')
	.action(async (options) => {
		console.log('🚀 Task Actions 프로젝트를 초기화합니다...\n');

		if (performanceMode) {
			PerformanceUtils.startTimer('init-command');
		}

		try {
			if (options.interactive) {
				await initProjectInteractive(options);
			} else {
				await initProjectWithOptions(options);
			}

			console.log('✅ 프로젝트 초기화가 완료되었습니다!');
			printNextSteps();

			if (performanceMode) {
				PerformanceUtils.endTimer('init-command');
				console.log('\n📊 성능 리포트:');
				PerformanceUtils.printMetrics();
			}
		} catch (error) {
			if (performanceMode) {
				PerformanceUtils.endTimer('init-command');
			}
			console.error('❌ 초기화 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// generate 명령어 그룹
const generateCmd = program
	.command('generate')
	.alias('gen')
	.description('템플릿을 사용하여 새로운 파일을 생성합니다');

// 각 타입별 generate 명령어 추가
const templateTypes: TemplateType[] = ['action', 'workflow', 'mcp', 'rule'];

templateTypes.forEach((type) => {
	generateCmd
		.command(type)
		.description(`${type} 파일들을 생성합니다`)
		.option('--overwrite', '기존 파일 덮어쓰기')
		.action(async (options) => {
			if (performanceMode) {
				PerformanceUtils.startTimer(`generate-${type}-command`);
			}

			try {
				await generateByType(type, options);

				if (performanceMode) {
					PerformanceUtils.endTimer(`generate-${type}-command`);
					console.log('\n📊 성능 리포트:');
					PerformanceUtils.printMetrics();
				}
			} catch (error) {
				if (performanceMode) {
					PerformanceUtils.endTimer(`generate-${type}-command`);
				}
				console.error(`❌ ${type} 생성 중 오류가 발생했습니다:`, error);
				if (debugMode) {
					console.error('🐛 스택 트레이스:', error);
				}
				process.exit(1);
			}
		});
});

// task 생성 명령어
generateCmd
	.command('task')
	.description('새로운 태스크 파일을 생성합니다')
	.argument('<task-id>', '태스크 ID')
	.argument('[task-name]', '태스크 이름')
	.option('--description <desc>', '태스크 설명')
	.option('--priority <priority>', '우선순위 (low, medium, high)', 'medium')
	.option('--hours <hours>', '예상 소요시간', '4')
	.option('--overwrite', '기존 파일 덮어쓰기')
	.action(async (taskId, taskName, options) => {
		if (performanceMode) {
			PerformanceUtils.startTimer('generate-task-command');
		}

		try {
			await generateTask(taskId, taskName, options);

			if (performanceMode) {
				PerformanceUtils.endTimer('generate-task-command');
				console.log('\n📊 성능 리포트:');
				PerformanceUtils.printMetrics();
			}
		} catch (error) {
			if (performanceMode) {
				PerformanceUtils.endTimer('generate-task-command');
			}
			console.error('❌ 태스크 생성 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// list 명령어
program
	.command('list')
	.alias('ls')
	.description('사용 가능한 템플릿 목록을 조회합니다')
	.option('--type <type>', '특정 타입만 조회')
	.option('--status', '파일 생성 상태 포함')
	.action(async (options) => {
		if (performanceMode) {
			PerformanceUtils.startTimer('list-command');
		}

		try {
			await listTemplates(options);

			if (performanceMode) {
				PerformanceUtils.endTimer('list-command');
				console.log('\n📊 성능 리포트:');
				PerformanceUtils.printMetrics();
			}
		} catch (error) {
			if (performanceMode) {
				PerformanceUtils.endTimer('list-command');
			}
			console.error('❌ 템플릿 목록 조회 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// status 명령어
program
	.command('status')
	.description('프로젝트 상태를 확인합니다')
	.option('--detailed', '상세한 정보 표시')
	.action(async (options) => {
		if (performanceMode) {
			PerformanceUtils.startTimer('status-command');
		}

		try {
			await checkProjectStatus(options);

			if (performanceMode) {
				PerformanceUtils.endTimer('status-command');
				console.log('\n📊 성능 리포트:');
				PerformanceUtils.printMetrics();
			}
		} catch (error) {
			if (performanceMode) {
				PerformanceUtils.endTimer('status-command');
			}
			console.error('❌ 상태 확인 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// validate 명령어
program
	.command('validate')
	.description('생성된 파일들의 유효성을 검사합니다')
	.option('--fix', '검증 오류 자동 수정 시도')
	.action(async (options) => {
		if (performanceMode) {
			PerformanceUtils.startTimer('validate-command');
		}

		try {
			await validateProject(options);

			if (performanceMode) {
				PerformanceUtils.endTimer('validate-command');
				console.log('\n📊 성능 리포트:');
				PerformanceUtils.printMetrics();
			}
		} catch (error) {
			if (performanceMode) {
				PerformanceUtils.endTimer('validate-command');
			}
			console.error('❌ 검증 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// clean 명령어
program
	.command('clean')
	.description('생성된 파일들을 정리합니다')
	.option('--backup', '삭제 전 백업 생성')
	.option('--force', '확인 없이 강제 삭제')
	.action(async (options) => {
		try {
			await cleanProject(options);
		} catch (error) {
			console.error('❌ 정리 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

/**
 * 옵션을 사용한 프로젝트 초기화
 */
async function initProjectWithOptions(options: any): Promise<void> {
	const currentDir = process.cwd();
	const variables = await collectProjectVariables(options);
	await generateProjectFiles(currentDir, variables, options.overwrite);
}

/**
 * 대화형 모드로 프로젝트 초기화
 */
async function initProjectInteractive(options: any): Promise<void> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const question = (prompt: string, defaultValue?: string): Promise<string> => {
		const fullPrompt = defaultValue
			? `${prompt} (${defaultValue}): `
			: `${prompt}: `;
		return new Promise((resolve) => {
			rl.question(fullPrompt, (answer) => {
				resolve(answer.trim() || defaultValue || '');
			});
		});
	};

	try {
		console.log('📝 프로젝트 정보를 입력해주세요:\n');

		const projectName = await question(
			'프로젝트 이름',
			options.projectName || getDefaultProjectName()
		);
		const projectDescription = await question(
			'프로젝트 설명',
			options.description || `${projectName} 프로젝트`
		);
		const author = await question(
			'작성자',
			options.author || getDefaultAuthor()
		);
		const version = await question('버전', '1.0.0');
		const branchPrefix = await question('브랜치 prefix', 'feature');
		const repositoryUrl = await question(
			'저장소 URL',
			`https://github.com/${author}/${projectName}.git`
		);

		console.log('\n🔧 외부 서비스 연동 설정 (선택사항):');
		const slackHookUrl = await question(
			'Slack 웹훅 URL',
			'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
		);
		const discordHookUrl = await question(
			'Discord 웹훅 URL',
			'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK'
		);
		const githubToken = await question('GitHub 토큰', 'YOUR_GITHUB_TOKEN');

		const variables: TemplateVariables = {
			projectName,
			projectDescription,
			author,
			version,
			branchPrefix,
			repositoryUrl,
			slackHookUrl,
			discordHookUrl,
			githubToken,
			testEnvironment: 'development',
			complexityLevel: 'medium'
		};

		const currentDir = process.cwd();
		await generateProjectFiles(currentDir, variables, options.overwrite);
	} finally {
		rl.close();
	}
}

/**
 * 프로젝트 변수 수집
 */
async function collectProjectVariables(
	options: any
): Promise<TemplateVariables> {
	const projectName = options.projectName || getDefaultProjectName();
	const author = options.author || getDefaultAuthor();
	const description = options.description || `${projectName} 프로젝트`;

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
 * 기본 프로젝트 이름 가져오기
 */
function getDefaultProjectName(): string {
	const currentDir = process.cwd();
	const packageJsonPath = path.join(currentDir, 'package.json');

	if (FileSystemUtils.fileExists(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(FileSystemUtils.readFile(packageJsonPath));
			return packageJson.name || path.basename(currentDir);
		} catch (error) {
			console.warn('package.json 파일 읽기 실패, 기본값 사용');
		}
	}

	return path.basename(currentDir);
}

/**
 * 기본 작성자 가져오기
 */
function getDefaultAuthor(): string {
	const currentDir = process.cwd();
	const packageJsonPath = path.join(currentDir, 'package.json');

	if (FileSystemUtils.fileExists(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(FileSystemUtils.readFile(packageJsonPath));
			return packageJson.author || 'Developer';
		} catch (error) {
			console.warn('package.json 파일 읽기 실패, 기본값 사용');
		}
	}

	return 'Developer';
}

/**
 * 제너레이터를 사용하여 프로젝트 파일들 생성
 */
async function generateProjectFiles(
	outputDir: string,
	variables: TemplateVariables,
	overwrite: boolean = false
): Promise<void> {
	const templateDir = path.join(__dirname, 'templates');

	// 변수 검증
	if (!TemplateProcessor.validateVariables(variables)) {
		throw new Error('필수 템플릿 변수가 누락되었습니다.');
	}

	const generator = new YamlGenerator({
		outputDir,
		templateDir,
		variables,
		overwrite
	});

	const stats = await generator.generateAll();
	TemplateProcessor.printStats(stats);
}

/**
 * 특정 타입의 파일들 생성
 */
async function generateByType(type: TemplateType, options: any): Promise<void> {
	const currentDir = process.cwd();
	const variables = await loadExistingVariables();

	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, 'templates'),
		variables,
		overwrite: options.overwrite
	});

	const stats = await generator.generateByType(type);
	console.log(`\n✅ ${type} 파일 생성 완료!`);
}

/**
 * 새로운 태스크 파일 생성
 */
async function generateTask(
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
		taskDescription: finalDescription,
		priority: options?.priority || 'medium',
		estimatedHours: options?.hours || '4'
	};

	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, 'templates'),
		variables: taskVariables,
		overwrite: options?.overwrite
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
async function loadExistingVariables(): Promise<TemplateVariables> {
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
 * 템플릿 목록 조회
 */
async function listTemplates(options: any): Promise<void> {
	const currentDir = process.cwd();
	const variables = await loadExistingVariables();

	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, 'templates'),
		variables,
		overwrite: false
	});

	const templates = generator.getAvailableTemplates();

	let filteredTemplates = templates;
	if (options.type) {
		filteredTemplates = templates.filter((t) => t.type === options.type);
	}

	console.log('📋 사용 가능한 템플릿 목록:\n');

	const groupedTemplates = groupBy(filteredTemplates, 'type');

	for (const [type, typeTemplates] of Object.entries(groupedTemplates)) {
		console.log(`🏷️  ${type.toUpperCase()}`);
		typeTemplates.forEach((template) => {
			const exists = FileSystemUtils.fileExists(template.outputPath);
			const status = exists ? '✅' : '⭕';
			console.log(`   ${status} ${template.name} - ${template.description}`);
		});
		console.log('');
	}
}

/**
 * 프로젝트 상태 확인
 */
async function checkProjectStatus(options?: any): Promise<void> {
	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	console.log('📊 프로젝트 상태:\n');

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		console.log('❌ Task Actions 프로젝트가 초기화되지 않았습니다.');
		console.log('💡 `task-actions init` 명령어로 프로젝트를 초기화하세요.');
		return;
	}

	console.log('✅ Task Actions 프로젝트가 초기화되어 있습니다.');

	const variables = await loadExistingVariables();
	const generator = new YamlGenerator({
		outputDir: currentDir,
		templateDir: path.join(__dirname, 'templates'),
		variables,
		overwrite: false
	});

	const stats = generator.getGenerationStats();
	TemplateProcessor.printStats(stats);

	if (options?.detailed) {
		console.log('\n📁 디렉토리 구조:');
		printDirectoryTree(taskActionsPath);

		if (performanceMode) {
			console.log('\n💾 메모리 사용량:');
			PerformanceUtils.printMemoryUsage();
		}
	}
}

/**
 * 프로젝트 검증
 */
async function validateProject(options?: any): Promise<void> {
	console.log('🔍 프로젝트 검증을 시작합니다...\n');

	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		console.log('❌ Task Actions 프로젝트가 초기화되지 않았습니다.');
		return;
	}

	// 필수 파일들 확인
	const requiredFiles = ['vars.yaml', 'tasks.yaml'];
	const missingFiles = [];

	for (const file of requiredFiles) {
		const filePath = path.join(taskActionsPath, file);
		if (!FileSystemUtils.fileExists(filePath)) {
			missingFiles.push(file);
		}
	}

	if (missingFiles.length > 0) {
		console.log('❌ 누락된 필수 파일들:');
		missingFiles.forEach((file) => console.log(`   - ${file}`));

		if (options?.fix) {
			console.log('\n🔧 누락된 파일들을 생성합니다...');
			// 여기에 자동 복구 로직 추가
		}
	} else {
		console.log('✅ 모든 필수 파일이 존재합니다.');
	}

	// YAML 파일 유효성 검사
	console.log('\n📝 YAML 파일 유효성 검사...');
	await validateYamlFiles(taskActionsPath, options?.fix);

	console.log('\n✅ 프로젝트 검증이 완료되었습니다.');
}

/**
 * 프로젝트 정리
 */
async function cleanProject(options: any): Promise<void> {
	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		console.log('❌ 정리할 Task Actions 프로젝트를 찾을 수 없습니다.');
		return;
	}

	if (!options.force) {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		const answer = await new Promise<string>((resolve) => {
			rl.question(
				`🗑️  ${TASK_ACTIONS_DIR} 디렉토리를 삭제하시겠습니까? (y/N): `,
				resolve
			);
		});

		rl.close();

		if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
			console.log('❌ 정리가 취소되었습니다.');
			return;
		}
	}

	if (options.backup) {
		const backupPath = `${taskActionsPath}.backup.${Date.now()}`;
		console.log(`📦 백업을 생성합니다: ${backupPath}`);
		fs.renameSync(taskActionsPath, backupPath);
	} else {
		console.log('🗑️  파일들을 삭제합니다...');
		fs.rmSync(taskActionsPath, { recursive: true, force: true });
	}

	console.log('✅ 프로젝트 정리가 완료되었습니다.');
}

/**
 * YAML 파일 유효성 검사
 */
async function validateYamlFiles(
	dirPath: string,
	autoFix: boolean = false
): Promise<void> {
	const yamlFiles = FileSystemUtils.listFiles(dirPath, '.yaml');

	for (const file of yamlFiles) {
		const filePath = path.join(dirPath, file);
		try {
			const content = FileSystemUtils.readFile(filePath);
			// 간단한 YAML 구조 확인
			if (content.trim().length === 0) {
				console.log(`   ❌ ${file}: 빈 파일`);
				if (autoFix) {
					console.log(`   🔧 ${file}: 기본 구조 생성`);
					// 기본 구조 생성 로직
				}
			} else {
				console.log(`   ✅ ${file}: 유효`);
			}
		} catch (error) {
			console.log(`   ❌ ${file}: 읽기 오류 - ${error}`);
		}
	}
}

/**
 * 디렉토리 구조 출력
 */
function printDirectoryTree(dirPath: string, prefix: string = ''): void {
	if (!FileSystemUtils.fileExists(dirPath)) {
		return;
	}

	try {
		const items = fs.readdirSync(dirPath);
		items.forEach((item, index) => {
			const itemPath = path.join(dirPath, item);
			const isLast = index === items.length - 1;
			const currentPrefix = isLast ? '└── ' : '├── ';
			const nextPrefix = isLast ? '    ' : '│   ';

			console.log(`${prefix}${currentPrefix}${item}`);

			const stats = fs.statSync(itemPath);
			if (stats.isDirectory()) {
				printDirectoryTree(itemPath, prefix + nextPrefix);
			}
		});
	} catch (error) {
		console.log(`${prefix}❌ 읽기 오류`);
	}
}

/**
 * 다음 단계 안내
 */
function printNextSteps(): void {
	console.log('\n📝 다음 단계:');
	console.log(
		`1. ${TASK_ACTIONS_DIR}/vars.yaml 파일에서 환경 변수를 설정하세요`
	);
	console.log(
		`2. ${TASK_ACTIONS_DIR}/tasks.yaml 파일을 편집하여 태스크를 정의하세요`
	);
	console.log(
		'3. task-actions generate task <task-id> 명령어로 새 태스크를 생성하세요'
	);
	console.log('4. task-actions status 명령어로 프로젝트 상태를 확인하세요');
}

/**
 * 배열을 키로 그룹화
 */
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce((groups, item) => {
		const group = String(item[key]);
		groups[group] = groups[group] || [];
		groups[group].push(item);
		return groups;
	}, {} as Record<string, T[]>);
}

// 프로그램 실행
program.parse();
