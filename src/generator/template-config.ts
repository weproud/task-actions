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

// Template scanner instance
const templateScanner = new TemplateScanner();

// Dynamically generated template groups (cache)
let cachedTemplateGroups: TemplateGroup[] | null = null;

// Task template (special handling)
export const TASK_TEMPLATE = tasksTemplates.TASK_TEMPLATE;

/**
 * Find template group by template type
 */
export async function getTemplateGroup(
	type: string
): Promise<TemplateGroup | undefined> {
	const groups = await getAllTemplateGroups();
	return groups.find((group) => group.type === type);
}

/**
 * Get all template groups (dynamic scan)
 */
export async function getAllTemplateGroups(): Promise<TemplateGroup[]> {
	// Return cached result if available
	if (cachedTemplateGroups) {
		return cachedTemplateGroups;
	}

	try {
		// Create template groups through dynamic scan
		cachedTemplateGroups = await templateScanner.scanAllTemplateGroups();

		console.log(
			`📁 Auto-scanned ${cachedTemplateGroups.length} template groups:`
		);
		cachedTemplateGroups.forEach((group) => {
			console.log(
				`   - ${group.displayName}: ${group.templates.length} templates`
			);
		});

		return cachedTemplateGroups;
	} catch (error) {
		console.error('Error occurred during template scan:', error);

		// Return empty array on error
		cachedTemplateGroups = [];
		return cachedTemplateGroups;
	}
}

/**
 * Clear template groups cache (for use during development)
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
