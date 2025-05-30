import * as fs from 'fs';
import * as path from 'path';
import { TemplateGroup, TemplateConfig } from './types';
import { YamlTemplate } from '../templates/types';

/**
 * Class that scans template directories and automatically registers templates
 */
export class TemplateScanner {
	private templatesPath: string;

	constructor() {
		// Determine template path based on current script execution location
		// development: executed from src/generator -> ../templates
		// production: executed from dist/generator -> ../templates
		this.templatesPath = path.join(__dirname, '../templates');
	}

	/**
	 * Dynamically scan and generate all template groups
	 */
	async scanAllTemplateGroups(): Promise<TemplateGroup[]> {
		const templateGroups: TemplateGroup[] = [];

		// Scan each category directory
		const categories = ['actions', 'workflows', 'mcps', 'rules', 'base'];

		for (const category of categories) {
			const group = await this.scanTemplateGroup(category);
			if (group && group.templates.length > 0) {
				templateGroups.push(group);
			}
		}

		return templateGroups;
	}

	/**
	 * 특정 카테고리의 템플릿 그룹을 스캔
	 */
	private async scanTemplateGroup(
		category: string
	): Promise<TemplateGroup | null> {
		const categoryPath = path.join(this.templatesPath, category);

		if (!fs.existsSync(categoryPath)) {
			return null;
		}

		const templates = await this.scanTemplatesInDirectory(categoryPath);

		if (templates.length === 0) {
			return null;
		}

		// 카테고리별 설정
		const groupConfig = this.getCategoryConfig(category);

		return {
			type: groupConfig.type,
			displayName: groupConfig.displayName,
			subdirectory: groupConfig.subdirectory,
			templates
		};
	}

	/**
	 * Scan all template files in directory
	 */
	private async scanTemplatesInDirectory(
		dirPath: string
	): Promise<TemplateConfig[]> {
		const templates: TemplateConfig[] = [];

		try {
			const files = fs.readdirSync(dirPath);

			for (const file of files) {
				// Process only .js files that are not index.js (built environment)
				if (file.endsWith('.js') && file !== 'index.js') {
					const template = await this.loadTemplateFromFile(dirPath, file);
					if (template) {
						templates.push(template);
					}
				}
			}
		} catch (error) {
			console.warn(`Error during template directory scan: ${dirPath}`, error);
		}

		return templates.sort((a, b) => a.filename.localeCompare(b.filename));
	}

	/**
	 * Load template from individual template file
	 */
	private async loadTemplateFromFile(
		dirPath: string,
		filename: string
	): Promise<TemplateConfig | null> {
		try {
			const filePath = path.join(dirPath, filename);
			const module = await import(filePath);

			// Find first exported template from file
			const templateKey = Object.keys(module).find(
				(key) => key.endsWith('_TEMPLATE') && module[key]?.name
			);

			if (!templateKey || !module[templateKey]) {
				return null;
			}

			const template: YamlTemplate = module[templateKey];

			// Generate yaml filename from filename (e.g., test.js -> test.yaml)
			const yamlFilename = filename.replace('.js', '.yaml');

			return {
				template: template as any, // Temporary casting for type compatibility
				filename: yamlFilename
			};
		} catch (error) {
			// Silent failure handling (since templates are optional)
			return null;
		}
	}

	/**
	 * 카테고리별 설정 반환
	 */
	private getCategoryConfig(category: string) {
		const configs: Record<string, any> = {
			actions: {
				type: 'action',
				displayName: '액션',
				subdirectory: 'actions'
			},
			workflows: {
				type: 'workflow',
				displayName: '워크플로우',
				subdirectory: 'workflows'
			},
			mcps: {
				type: 'mcp',
				displayName: 'MCP',
				subdirectory: 'mcps'
			},
			rules: {
				type: 'rule',
				displayName: '규칙',
				subdirectory: 'rules'
			},
			base: {
				type: 'vars',
				displayName: '기본 설정',
				subdirectory: ''
			}
		};

		return (
			configs[category] || {
				type: category,
				displayName: category,
				subdirectory: category
			}
		);
	}
}
