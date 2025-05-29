import * as fs from 'fs';
import * as path from 'path';
import { TemplateGroup, TemplateConfig } from './types';
import { YamlTemplate } from '../templates/types';

/**
 * 템플릿 디렉토리를 스캔하여 자동으로 템플릿을 등록하는 클래스
 */
export class TemplateScanner {
	private templatesPath: string;

	constructor() {
		// 현재 스크립트가 실행되는 위치 기준으로 템플릿 경로 결정
		// development: src/generator에서 실행 -> ../templates
		// production: dist/generator에서 실행 -> ../templates
		this.templatesPath = path.join(__dirname, '../templates');
	}

	/**
	 * 모든 템플릿 그룹을 동적으로 스캔하여 생성
	 */
	async scanAllTemplateGroups(): Promise<TemplateGroup[]> {
		const templateGroups: TemplateGroup[] = [];

		// 각 카테고리 디렉토리 스캔
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
	 * 디렉토리 내의 모든 템플릿 파일을 스캔
	 */
	private async scanTemplatesInDirectory(
		dirPath: string
	): Promise<TemplateConfig[]> {
		const templates: TemplateConfig[] = [];

		try {
			const files = fs.readdirSync(dirPath);

			for (const file of files) {
				// .js 파일이고 index.js가 아닌 경우만 처리 (빌드된 환경)
				if (file.endsWith('.js') && file !== 'index.js') {
					const template = await this.loadTemplateFromFile(dirPath, file);
					if (template) {
						templates.push(template);
					}
				}
			}
		} catch (error) {
			console.warn(`템플릿 디렉토리 스캔 중 오류: ${dirPath}`, error);
		}

		return templates.sort((a, b) => a.filename.localeCompare(b.filename));
	}

	/**
	 * 개별 템플릿 파일에서 템플릿을 로드
	 */
	private async loadTemplateFromFile(
		dirPath: string,
		filename: string
	): Promise<TemplateConfig | null> {
		try {
			const filePath = path.join(dirPath, filename);
			const module = await import(filePath);

			// 파일에서 첫 번째 export된 템플릿 찾기
			const templateKey = Object.keys(module).find(
				(key) => key.endsWith('_TEMPLATE') && module[key]?.name
			);

			if (!templateKey || !module[templateKey]) {
				return null;
			}

			const template: YamlTemplate = module[templateKey];

			// 파일명에서 yaml 파일명 생성 (예: test.js -> test.yaml)
			const yamlFilename = filename.replace('.js', '.yaml');

			return {
				template,
				filename: yamlFilename
			};
		} catch (error) {
			// 조용히 실패 처리 (선택적 템플릿이므로)
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
