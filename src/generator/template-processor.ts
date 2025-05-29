import {
	TemplateVariables,
	TemplateGroup,
	TemplateConfig,
	FileGenerationResult,
	GenerationStats
} from './types';
import { YamlTemplate } from '../templates/types';
import { FileSystemUtils } from './file-system-utils';
import { TASK_ACTIONS_DIR } from './template-config';

/**
 * 템플릿 처리를 담당하는 유틸리티 클래스
 */
export class TemplateProcessor {
	/**
	 * 템플릿 변수를 치환하는 헬퍼 함수
	 */
	static replaceTemplateVariables(
		content: Record<string, unknown>,
		variables: TemplateVariables
	): Record<string, unknown> {
		const jsonString = JSON.stringify(content);
		const replacedString = jsonString.replace(
			/\{\{(\w+)\}\}/g,
			(match, key) => {
				const value = variables[key];
				return value !== undefined ? String(value) : match;
			}
		);

		try {
			return JSON.parse(replacedString);
		} catch {
			return content;
		}
	}

	/**
	 * YAML 템플릿에서 파일 생성
	 */
	static generateYamlFromTemplate(
		template: YamlTemplate | Record<string, unknown> | unknown,
		outputPath: string,
		variables: TemplateVariables,
		overwrite: boolean = false
	): FileGenerationResult {
		let content: Record<string, unknown>;

		// YamlTemplate 타입인지 확인
		if (template && typeof template === 'object' && 'content' in template) {
			const yamlTemplate = template as YamlTemplate;
			content = yamlTemplate.content as Record<string, unknown>;
		} else if (template && typeof template === 'object') {
			content = template as Record<string, unknown>;
		} else {
			// 기본 빈 객체
			content = {};
		}

		// 템플릿 변수 치환
		const processedContent = this.replaceTemplateVariables(content, variables);

		// YAML 파일로 저장
		return FileSystemUtils.saveYamlFile(
			processedContent,
			outputPath,
			overwrite
		);
	}

	/**
	 * 템플릿 그룹의 모든 파일을 생성
	 */
	static generateTemplateGroup(
		group: TemplateGroup,
		baseDir: string,
		variables: TemplateVariables,
		overwrite: boolean = false
	): FileGenerationResult[] {
		console.log(`\n📄 ${group.displayName} 파일들을 생성합니다...`);

		const results: FileGenerationResult[] = [];

		for (const templateConfig of group.templates) {
			const outputPath = this.buildOutputPath(
				baseDir,
				group.subdirectory,
				templateConfig.filename
			);

			const result = this.generateYamlFromTemplate(
				templateConfig.template,
				outputPath,
				variables,
				overwrite
			);

			results.push(result);
		}

		return results;
	}

	/**
	 * 출력 경로 생성
	 */
	static buildOutputPath(
		baseDir: string,
		subdirectory: string,
		filename: string
	): string {
		if (subdirectory) {
			return FileSystemUtils.createOutputPath(
				baseDir,
				`${TASK_ACTIONS_DIR}/${subdirectory}`,
				filename
			);
		} else {
			return FileSystemUtils.createOutputPath(
				baseDir,
				TASK_ACTIONS_DIR,
				filename
			);
		}
	}

	/**
	 * 여러 템플릿 그룹을 한 번에 생성
	 */
	static generateMultipleGroups(
		groups: TemplateGroup[],
		baseDir: string,
		variables: TemplateVariables,
		overwrite: boolean = false
	): GenerationStats {
		const allResults: FileGenerationResult[] = [];

		for (const group of groups) {
			const groupResults = this.generateTemplateGroup(
				group,
				baseDir,
				variables,
				overwrite
			);
			allResults.push(...groupResults);
		}

		return this.calculateStats(allResults);
	}

	/**
	 * 개별 템플릿 파일 생성
	 */
	static generateSingleTemplate(
		template: YamlTemplate,
		outputPath: string,
		variables: TemplateVariables,
		overwrite: boolean = false
	): FileGenerationResult {
		return this.generateYamlFromTemplate(
			template,
			outputPath,
			variables,
			overwrite
		);
	}

	/**
	 * 생성 통계 계산
	 */
	static calculateStats(results: FileGenerationResult[]): GenerationStats {
		const stats: GenerationStats = {
			totalFiles: results.length,
			createdFiles: 0,
			skippedFiles: 0,
			failedFiles: 0,
			results
		};

		for (const result of results) {
			if (result.success && !result.skipped) {
				stats.createdFiles++;
			} else if (result.skipped) {
				stats.skippedFiles++;
			} else {
				stats.failedFiles++;
			}
		}

		return stats;
	}

	/**
	 * 통계 출력
	 */
	static printStats(stats: GenerationStats): void {
		console.log(`\n📊 생성 통계:`);
		console.log(`   총 파일 수: ${stats.totalFiles}`);
		console.log(`   생성된 파일: ${stats.createdFiles}`);
		console.log(`   건너뛴 파일: ${stats.skippedFiles}`);

		if (stats.failedFiles > 0) {
			console.log(`   실패한 파일: ${stats.failedFiles}`);

			const failedResults = stats.results.filter((r) => !r.success);
			console.log(`\n❌ 실패한 파일들:`);
			for (const failed of failedResults) {
				console.log(`   - ${failed.path}: ${failed.error}`);
			}
		}
	}

	/**
	 * 특정 타입의 템플릿만 필터링
	 */
	static filterTemplatesByType(
		groups: TemplateGroup[],
		type: string
	): TemplateGroup[] {
		return groups.filter((group) => group.type === type);
	}

	/**
	 * 템플릿 검증
	 */
	static validateTemplate(template: YamlTemplate): boolean {
		try {
			if (!template || !template.content) {
				return false;
			}

			// 기본적인 YAML 유효성 검사
			JSON.stringify(template.content);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * 변수 검증 (타입 안전성 강화)
	 */
	static validateVariables(variables: TemplateVariables): boolean {
		const required = ['projectName', 'projectDescription', 'author', 'version'];

		for (const field of required) {
			const value = variables[field];
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				console.warn(`경고: 필수 변수 '${field}'가 누락되었습니다.`);
				return false;
			}
		}

		return true;
	}
}
