// src/index.ts
const message: string = 'Hello, TypeScript!';
console.log(message);

// 메인 제너레이터 클래스
export { YamlGenerator } from './generator';

// 유틸리티 클래스들
export {
	FileSystemUtils,
	TemplateProcessor,
	TemplateEngine,
	PerformanceUtils
} from './generator';

// 템플릿 설정 (TASK_TEMPLATE 제외하고 export)
export {
	TASK_ACTIONS_DIR,
	getTemplateGroup,
	getAllTemplateGroups,
	getDirectoryConfig,
	DIRECTORY_CONFIG
} from './generator/template-config';

// 타입 정의
export * from './generator/types';

// 템플릿들 (모든 템플릿 export)
export * from './templates';
