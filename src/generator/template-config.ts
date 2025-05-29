import { TemplateGroup, DirectoryConfig } from './types';
import { TemplateScanner } from './template-scanner';

// 템플릿 imports (tasks 템플릿은 특별 처리를 위해 유지)
import * as tasksTemplates from '../templates/tasks';

// task-actions 디렉토리 상수
export const TASK_ACTIONS_DIR = '.task-actions';

// 디렉토리 설정
export const DIRECTORY_CONFIG: DirectoryConfig[] = [
	{ name: TASK_ACTIONS_DIR, path: TASK_ACTIONS_DIR, required: true },
	{ name: 'actions', path: `${TASK_ACTIONS_DIR}/actions`, required: true },
	{ name: 'workflows', path: `${TASK_ACTIONS_DIR}/workflows`, required: true },
	{ name: 'mcps', path: `${TASK_ACTIONS_DIR}/mcps`, required: true },
	{ name: 'rules', path: `${TASK_ACTIONS_DIR}/rules`, required: true }
];

// 템플릿 스캐너 인스턴스
const templateScanner = new TemplateScanner();

// 동적으로 생성된 템플릿 그룹들 (캐시)
let cachedTemplateGroups: TemplateGroup[] | null = null;

// 태스크 템플릿 (특별 처리)
export const TASK_TEMPLATE = tasksTemplates.TASK_TEMPLATE;

/**
 * 템플릿 타입으로 템플릿 그룹 찾기
 */
export async function getTemplateGroup(
	type: string
): Promise<TemplateGroup | undefined> {
	const groups = await getAllTemplateGroups();
	return groups.find((group) => group.type === type);
}

/**
 * 모든 템플릿 그룹 가져오기 (동적 스캔)
 */
export async function getAllTemplateGroups(): Promise<TemplateGroup[]> {
	// 캐시된 결과가 있으면 반환
	if (cachedTemplateGroups) {
		return cachedTemplateGroups;
	}

	try {
		// 동적 스캔으로 템플릿 그룹 생성
		cachedTemplateGroups = await templateScanner.scanAllTemplateGroups();

		console.log(
			`📁 ${cachedTemplateGroups.length}개의 템플릿 그룹을 자동 스캔했습니다:`
		);
		cachedTemplateGroups.forEach((group) => {
			console.log(
				`   - ${group.displayName}: ${group.templates.length}개 템플릿`
			);
		});

		return cachedTemplateGroups;
	} catch (error) {
		console.error('템플릿 스캔 중 오류가 발생했습니다:', error);

		// 에러 발생 시 빈 배열 반환
		cachedTemplateGroups = [];
		return cachedTemplateGroups;
	}
}

/**
 * 템플릿 그룹 캐시 초기화 (개발 중 사용)
 */
export function clearTemplateGroupsCache(): void {
	cachedTemplateGroups = null;
}

/**
 * 디렉토리 설정 가져오기
 */
export function getDirectoryConfig(): DirectoryConfig[] {
	return DIRECTORY_CONFIG;
}
