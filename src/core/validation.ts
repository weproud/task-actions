import * as path from 'path';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { FileSystemUtils, TASK_ACTIONS_DIR } from '../generator';
import { ValidationResult } from './types';

// 검증할 파일 타입별 인터페이스 정의
interface BaseYamlConfig {
	version: number;
	kind: string;
	name: string;
	description: string;
	prompt: string;
}

interface TaskConfig extends BaseYamlConfig {
	id: string;
	status: string;
	jobs: {
		workflow?: string;
		rules?: string[];
		mcps?: string[];
	};
}

interface WorkflowConfig extends BaseYamlConfig {
	jobs: {
		steps: Array<{
			name: string;
			uses?: string;
			prompt?: string;
		}>;
	};
}

/**
 * YAML 파일의 필수 항목 검증
 */
function validateRequiredFields(config: any, filePath: string): string[] {
	const requiredFields = ['version', 'kind', 'name', 'description', 'prompt'];
	const errors: string[] = [];

	for (const field of requiredFields) {
		if (
			!config ||
			config[field] === undefined ||
			config[field] === null ||
			config[field] === ''
		) {
			errors.push(`${filePath}: 필수 항목 '${field}'가 누락되었습니다.`);
		}
	}

	return errors;
}

/**
 * YAML 파일 읽기 및 파싱
 */
async function loadYamlFile(
	filePath: string
): Promise<{ config: any; errors: string[] }> {
	const errors: string[] = [];

	try {
		// 파일 존재 확인
		await fs.access(filePath);

		// 파일 읽기
		const content = await fs.readFile(filePath, 'utf-8');

		if (content.trim().length === 0) {
			errors.push(`${filePath}: 빈 파일입니다.`);
			return { config: null, errors };
		}

		// YAML 파싱
		const config = yaml.load(content);

		if (!config) {
			errors.push(`${filePath}: YAML 파싱에 실패했습니다.`);
			return { config: null, errors };
		}

		return { config, errors };
	} catch (error) {
		if ((error as any).code === 'ENOENT') {
			errors.push(`${filePath}: 파일이 존재하지 않습니다.`);
		} else {
			errors.push(`${filePath}: 파일 읽기 오류 - ${(error as Error).message}`);
		}
		return { config: null, errors };
	}
}

/**
 * 워크플로우 파일 및 그 내부 uses 파일들을 재귀적으로 검증
 */
async function validateWorkflowRecursively(
	workflowPath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', workflowPath);

	// 순환 참조 방지
	if (visitedFiles.has(fullPath)) {
		errors.push(`${workflowPath}: 순환 참조가 감지되었습니다.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   📄 Workflow 검증 중: ${workflowPath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// 필수 필드 검증
	errors.push(...validateRequiredFields(config, workflowPath));

	// WorkflowConfig 타입 검증
	const workflowConfig = config as WorkflowConfig;

	if (
		!workflowConfig.jobs ||
		!workflowConfig.jobs.steps ||
		!Array.isArray(workflowConfig.jobs.steps)
	) {
		errors.push(`${workflowPath}: 올바른 jobs.steps 배열이 없습니다.`);
		return errors;
	}

	// 각 step의 uses 파일들을 재귀적으로 검증
	for (const step of workflowConfig.jobs.steps) {
		if (step.uses) {
			const actionErrors = await validateActionFile(step.uses, visitedFiles);
			errors.push(...actionErrors);
		}
		if (step.prompt) {
			const promptErrors = await validateActionFile(step.prompt, visitedFiles);
			errors.push(...promptErrors);
		}
	}

	return errors;
}

/**
 * Action 파일 검증
 */
async function validateActionFile(
	actionPath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', actionPath);

	// 순환 참조 방지
	if (visitedFiles.has(fullPath)) {
		errors.push(`${actionPath}: 순환 참조가 감지되었습니다.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`     🎬 Action 검증 중: ${actionPath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// 필수 필드 검증
	errors.push(...validateRequiredFields(config, actionPath));

	return errors;
}

/**
 * Rule 파일 검증
 */
async function validateRuleFile(
	rulePath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', rulePath);

	// 순환 참조 방지
	if (visitedFiles.has(fullPath)) {
		errors.push(`${rulePath}: 순환 참조가 감지되었습니다.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   📜 Rule 검증 중: ${rulePath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// 필수 필드 검증
	errors.push(...validateRequiredFields(config, rulePath));

	return errors;
}

/**
 * MCP 파일 검증
 */
async function validateMcpFile(
	mcpPath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', mcpPath);

	// 순환 참조 방지
	if (visitedFiles.has(fullPath)) {
		errors.push(`${mcpPath}: 순환 참조가 감지되었습니다.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   🔧 MCP 검증 중: ${mcpPath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// 필수 필드 검증
	errors.push(...validateRequiredFields(config, mcpPath));

	return errors;
}

/**
 * Task 파일 검증 및 참조되는 모든 파일들을 재귀적으로 검증
 */
async function validateTaskFile(taskFilePath: string): Promise<string[]> {
	const errors: string[] = [];
	const visitedFiles = new Set<string>();

	console.log(`🎯 Task 파일 검증: ${taskFilePath}`);

	const { config, errors: loadErrors } = await loadYamlFile(taskFilePath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// 필수 필드 검증
	errors.push(...validateRequiredFields(config, taskFilePath));

	// TaskConfig 타입 검증
	const taskConfig = config as TaskConfig;

	if (!taskConfig.jobs) {
		errors.push(`${taskFilePath}: jobs 섹션이 없습니다.`);
		return errors;
	}

	// Workflow 검증
	if (taskConfig.jobs.workflow) {
		const workflowErrors = await validateWorkflowRecursively(
			taskConfig.jobs.workflow,
			visitedFiles
		);
		errors.push(...workflowErrors);
	}

	// Rules 검증
	if (taskConfig.jobs.rules && Array.isArray(taskConfig.jobs.rules)) {
		for (const rulePath of taskConfig.jobs.rules) {
			const ruleErrors = await validateRuleFile(rulePath, visitedFiles);
			errors.push(...ruleErrors);
		}
	}

	// MCPs 검증
	if (taskConfig.jobs.mcps && Array.isArray(taskConfig.jobs.mcps)) {
		for (const mcpPath of taskConfig.jobs.mcps) {
			const mcpErrors = await validateMcpFile(mcpPath, visitedFiles);
			errors.push(...mcpErrors);
		}
	}

	return errors;
}

/**
 * 프로젝트 검증
 */
export async function validateProject(): Promise<ValidationResult> {
	console.log('🔍 프로젝트 검증을 시작합니다...\n');

	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);
	const errors: string[] = [];
	const warnings: string[] = [];

	// .task-actions 디렉토리 존재 확인
	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		errors.push('Task Actions 프로젝트가 초기화되지 않았습니다.');
		return { isValid: false, errors, warnings };
	}

	// 필수 기본 파일들 확인
	const requiredFiles = ['vars.yaml', 'tasks.yaml'];
	const missingFiles = [];

	for (const file of requiredFiles) {
		const filePath = path.join(taskActionsPath, file);
		if (!FileSystemUtils.fileExists(filePath)) {
			missingFiles.push(file);
		}
	}

	if (missingFiles.length > 0) {
		errors.push(`누락된 필수 파일들: ${missingFiles.join(', ')}`);
	} else {
		console.log('✅ 모든 필수 기본 파일이 존재합니다.');
	}

	// Task 파일들 찾기 및 검증
	console.log('\n📝 Task 파일들을 검증합니다...');

	try {
		const files = await fs.readdir(taskActionsPath);
		const taskFiles = files.filter(
			(file) => file.startsWith('task-') && file.endsWith('.yaml')
		);

		if (taskFiles.length === 0) {
			warnings.push('Task 파일이 없습니다.');
		} else {
			console.log(`발견된 Task 파일: ${taskFiles.length}개\n`);

			// 각 Task 파일을 재귀적으로 검증
			for (const taskFile of taskFiles) {
				const taskFilePath = path.join(taskActionsPath, taskFile);
				const taskErrors = await validateTaskFile(taskFilePath);
				errors.push(...taskErrors);
			}
		}
	} catch (error) {
		errors.push(
			`Task 파일 목록을 읽는 중 오류 발생: ${(error as Error).message}`
		);
	}

	const isValid = errors.length === 0;

	console.log('\n' + '='.repeat(50));
	if (isValid) {
		console.log('✅ 프로젝트 검증이 완료되었습니다.');
		if (warnings.length > 0) {
			console.log('\n⚠️  경고:');
			warnings.forEach((warning) => console.log(`   - ${warning}`));
		}
	} else {
		console.log('❌ 프로젝트 검증 중 오류가 발견되었습니다:');
		errors.forEach((error) => console.log(`   - ${error}`));

		if (warnings.length > 0) {
			console.log('\n⚠️  추가 경고:');
			warnings.forEach((warning) => console.log(`   - ${warning}`));
		}
	}
	console.log('='.repeat(50));

	return { isValid, errors, warnings };
}

/**
 * YAML 파일 유효성 검사 (이전 버전과의 호환성을 위해 유지)
 */
export async function validateYamlFiles(dirPath: string): Promise<void> {
	const yamlFiles = FileSystemUtils.listFiles(dirPath, '.yaml');

	for (const file of yamlFiles) {
		const filePath = path.join(dirPath, file);
		try {
			const content = FileSystemUtils.readFile(filePath);
			// 간단한 YAML 구조 확인
			if (content.trim().length === 0) {
				console.log(`   ❌ ${file}: 빈 파일`);
				// 기본 구조 생성 로직
			} else {
				console.log(`   ✅ ${file}: 유효`);
			}
		} catch (error) {
			console.log(`   ❌ ${file}: 읽기 오류 - ${error}`);
		}
	}
}
