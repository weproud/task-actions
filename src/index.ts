// src/index.ts

// Main generator class
export { YamlGenerator } from './generator';

// Utility classes
export {
	FileSystemUtils,
	TemplateProcessor,
	TemplateEngine,
	PerformanceUtils
} from './generator';

// Template configuration (export all except TASK_TEMPLATE)
export {
	TASK_ACTIONS_DIR,
	getTemplateGroup,
	getAllTemplateGroups,
	getDirectoryConfig,
	DIRECTORY_CONFIG
} from './generator/template-config';

// Type definitions
export * from './generator/types';

// Templates (export all templates)
export * from './templates';
