import * as path from 'path';
import { FileSystemUtils, TASK_ACTIONS_DIR } from '../generator';
import { ValidationResult } from './types';

/**
 * YAML 파일 유효성 검사
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

/**
 * 프로젝트 검증
 */
export async function validateProject(): Promise<ValidationResult> {
	console.log('🔍 프로젝트 검증을 시작합니다...\n');

	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);
	const errors: string[] = [];
	const warnings: string[] = [];

	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		errors.push('Task Actions 프로젝트가 초기화되지 않았습니다.');
		return { isValid: false, errors, warnings };
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
		errors.push(`누락된 필수 파일들: ${missingFiles.join(', ')}`);
	} else {
		console.log('✅ 모든 필수 파일이 존재합니다.');
	}

	// YAML 파일 유효성 검사
	console.log('\n📝 YAML 파일 유효성 검사...');
	await validateYamlFiles(taskActionsPath);

	const isValid = errors.length === 0;

	if (isValid) {
		console.log('\n✅ 프로젝트 검증이 완료되었습니다.');
	} else {
		console.log('\n❌ 프로젝트 검증 중 오류가 발견되었습니다:');
		errors.forEach((error) => console.log(`   - ${error}`));
	}

	return { isValid, errors, warnings };
}
