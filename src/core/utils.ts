import * as fs from 'fs';
import * as path from 'path';
import { FileSystemUtils } from '../generator';

/**
 * 기본 프로젝트 이름 가져오기
 */
export function getDefaultProjectName(): string {
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
export function getDefaultAuthor(): string {
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
 * 디렉토리 구조 출력
 */
export function printDirectoryTree(dirPath: string, prefix: string = ''): void {
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
export function printNextSteps(): void {
	console.log('\n📝 다음 단계:');
	console.log(`1. .task-actions/vars.yaml 파일에서 환경 변수를 설정하세요`);
	console.log(
		`2. .task-actions/tasks.yaml 파일을 편집하여 태스크를 정의하세요`
	);
	console.log(
		'3. task-actions add task <task-id> 명령어로 새 태스크를 생성하세요'
	);
	console.log('4. task-actions status 명령어로 프로젝트 상태를 확인하세요');
}

/**
 * 배열을 키로 그룹화
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce((groups, item) => {
		const group = String(item[key]);
		groups[group] = groups[group] || [];
		groups[group].push(item);
		return groups;
	}, {} as Record<string, T[]>);
}
