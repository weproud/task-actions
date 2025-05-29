import * as path from 'path';
import { TemplateEngine } from './template-engine';
import {
	TemplateVariables,
	GeneratorOptions,
	TemplateMetadata,
	TemplateType,
	GenerationStats
} from './types';
import { YamlTemplate } from '../templates/types';
import { FileSystemUtils } from './file-system-utils';
import { TemplateProcessor } from './template-processor';
import { PerformanceUtils } from './performance-utils';
import {
	TASK_ACTIONS_DIR,
	TASK_TEMPLATE,
	getTemplateGroup,
	getAllTemplateGroups,
	getDirectoryConfig
} from './template-config';

/**
 * YAML 파일 제너레이터
 * 템플릿을 사용하여 프로젝트 구조와 설정 파일들을 생성
 */
export class YamlGenerator {
	private options: GeneratorOptions;

	constructor(options: GeneratorOptions) {
		this.options = options;
		this.validateOptions();
	}

	/**
	 * 모든 템플릿을 사용하여 프로젝트 초기화
	 */
	async generateAll(): Promise<GenerationStats> {
		console.log('🚀 YAML 파일들을 생성합니다...\n');

		PerformanceUtils.startTimer('generateAll');

		try {
			// 출력 디렉토리 구조 생성
			PerformanceUtils.startTimer('createDirectories');
			this.createDirectoryStructure();
			PerformanceUtils.endTimer('createDirectories');

			// 모든 템플릿 그룹 생성
			PerformanceUtils.startTimer('generateTemplates');
			const templateGroups = await getAllTemplateGroups();
			const stats = TemplateProcessor.generateMultipleGroups(
				templateGroups,
				this.options.outputDir,
				this.options.variables,
				this.options.overwrite
			);
			PerformanceUtils.endTimer('generateTemplates');

			const totalDuration = PerformanceUtils.endTimer('generateAll');

			// 성능 향상된 통계 출력
			const enhancedStats = PerformanceUtils.enhanceStats(stats, totalDuration);
			this.printEnhancedStats(enhancedStats);

			console.log('\n✅ 모든 YAML 파일 생성이 완료되었습니다!');

			return enhancedStats;
		} catch (error) {
			PerformanceUtils.endTimer('generateAll');
			console.error('❌ 파일 생성 중 오류가 발생했습니다:', error);
			throw error;
		}
	}

	/**
	 * 특정 타입의 파일만 생성
	 */
	async generateByType(type: TemplateType): Promise<GenerationStats> {
		console.log(`📄 ${type} 파일들을 생성합니다...`);

		PerformanceUtils.startTimer(`generateByType-${type}`);

		try {
			// 특정 타입의 템플릿 그룹 찾기
			const templateGroup = await getTemplateGroup(type);

			if (!templateGroup) {
				throw new Error(`Unknown template type: ${type}`);
			}

			// 디렉토리 구조 생성 (필요한 경우)
			this.createDirectoryStructure();

			// 템플릿 그룹 생성
			const results = TemplateProcessor.generateTemplateGroup(
				templateGroup,
				this.options.outputDir,
				this.options.variables,
				this.options.overwrite
			);

			const duration = PerformanceUtils.endTimer(`generateByType-${type}`);
			const stats = TemplateProcessor.calculateStats(results);
			const enhancedStats = PerformanceUtils.enhanceStats(stats, duration);

			this.printEnhancedStats(enhancedStats);
			console.log(`✅ ${type} 파일 생성 완료!`);

			return enhancedStats;
		} catch (error) {
			PerformanceUtils.endTimer(`generateByType-${type}`);
			console.error(`❌ ${type} 파일 생성 중 오류가 발생했습니다:`, error);
			throw error;
		}
	}

	/**
	 * 새로운 태스크 파일 생성
	 */
	async generateTask(
		taskId: string,
		taskName: string,
		taskDescription: string
	): Promise<void> {
		console.log(`📄 태스크 파일을 생성합니다: ${taskName}`);

		PerformanceUtils.startTimer(`generateTask-${taskId}`);

		try {
			const outputPath = path.join(
				this.options.outputDir,
				TASK_ACTIONS_DIR,
				`task-${taskId}.yaml`
			);

			// 태스크별 변수 추가
			const taskVariables: TemplateVariables = {
				...this.options.variables,
				taskId,
				taskName,
				taskDescription,
				priority: 'medium',
				estimatedHours: '4'
			};

			// 템플릿 검증
			if (!TemplateProcessor.validateTemplate(TASK_TEMPLATE)) {
				throw new Error('태스크 템플릿이 유효하지 않습니다.');
			}

			// 파일 생성
			const result = TemplateProcessor.generateSingleTemplate(
				TASK_TEMPLATE,
				outputPath,
				taskVariables,
				this.options.overwrite
			);

			if (!result.success) {
				throw new Error(result.error || '태스크 파일 생성에 실패했습니다.');
			}

			const duration = PerformanceUtils.endTimer(`generateTask-${taskId}`);
			console.log(`   생성 시간: ${duration.toFixed(2)}ms`);
			console.log('✅ 태스크 파일 생성 완료!');
		} catch (error) {
			PerformanceUtils.endTimer(`generateTask-${taskId}`);
			console.error('❌ 태스크 파일 생성 중 오류가 발생했습니다:', error);
			throw error;
		}
	}

	/**
	 * 사용 가능한 템플릿 목록 조회
	 */
	async getAvailableTemplates(): Promise<TemplateMetadata[]> {
		PerformanceUtils.startTimer('getAvailableTemplates');

		const templates: TemplateMetadata[] = [];

		// 각 템플릿 그룹에서 메타데이터 추출
		const templateGroups = await getAllTemplateGroups();
		for (const group of templateGroups) {
			for (const templateConfig of group.templates) {
				const outputPath = TemplateProcessor.buildOutputPath(
					this.options.outputDir,
					group.subdirectory,
					templateConfig.filename
				);

				// 템플릿에서 필요한 변수 추출 (간단한 구현)
				const requiredVariables = this.extractVariablesFromTemplate(
					templateConfig.template
				);

				templates.push({
					type: group.type,
					name: templateConfig.filename.replace('.yaml', ''),
					description: `${group.displayName} 템플릿`,
					templatePath: '', // TypeScript 템플릿이므로 경로 없음
					outputPath,
					requiredVariables
				});
			}
		}

		// 기존 파일 기반 템플릿도 스캔 (하위 호환성)
		const fileBasedTemplates = this.scanFileBasedTemplates();
		templates.push(...fileBasedTemplates);

		PerformanceUtils.endTimer('getAvailableTemplates');

		return templates;
	}

	/**
	 * 출력 디렉토리 구조 생성
	 */
	private createDirectoryStructure(): void {
		FileSystemUtils.createDirectories(
			this.options.outputDir,
			getDirectoryConfig()
		);
	}

	/**
	 * 옵션 검증
	 */
	private validateOptions(): void {
		if (!this.options.outputDir) {
			throw new Error('출력 디렉토리가 지정되지 않았습니다.');
		}

		if (!TemplateProcessor.validateVariables(this.options.variables)) {
			throw new Error('필수 템플릿 변수가 누락되었습니다.');
		}
	}

	/**
	 * 템플릿에서 변수 추출 (간단한 구현)
	 */
	private extractVariablesFromTemplate(template: YamlTemplate): string[] {
		try {
			const templateStr = JSON.stringify(template.content);
			return TemplateEngine.extractVariables(templateStr);
		} catch {
			return [];
		}
	}

	/**
	 * 파일 기반 템플릿 스캔 (하위 호환성)
	 */
	private scanFileBasedTemplates(): TemplateMetadata[] {
		PerformanceUtils.startTimer('scanFileBasedTemplates');

		const templates: TemplateMetadata[] = [];
		const templateDir = this.options.templateDir;

		if (!templateDir || !FileSystemUtils.fileExists(templateDir)) {
			PerformanceUtils.endTimer('scanFileBasedTemplates');
			return templates;
		}

		// 각 타입별 디렉토리 스캔
		const types: TemplateType[] = ['action', 'workflow', 'mcp', 'rule'];

		for (const type of types) {
			const typeDir = path.join(
				templateDir,
				type === 'action' ? 'actions' : `${type}s`
			);

			if (FileSystemUtils.fileExists(typeDir)) {
				const files = FileSystemUtils.listFiles(typeDir, '.template.yaml');

				for (const file of files) {
					const templatePath = path.join(typeDir, file);
					const outputPath = path.join(
						this.options.outputDir,
						TASK_ACTIONS_DIR,
						type === 'action' ? 'actions' : `${type}s`,
						file.replace('.template', '')
					);

					// 템플릿에서 필요한 변수 추출
					const requiredVariables =
						TemplateEngine.extractVariablesFromFile(templatePath);

					templates.push({
						type,
						name: file.replace('.template.yaml', ''),
						description: `${type} template`,
						templatePath,
						outputPath,
						requiredVariables
					});
				}
			}
		}

		PerformanceUtils.endTimer('scanFileBasedTemplates');
		return templates;
	}

	/**
	 * 생성 통계 조회
	 */
	async getGenerationStats(): Promise<GenerationStats> {
		PerformanceUtils.startTimer('getGenerationStats');

		try {
			const templateGroups = await getAllTemplateGroups();
			let totalTemplates = 0;
			let totalGroups = templateGroups.length;

			// 각 그룹의 템플릿 수 계산
			for (const group of templateGroups) {
				totalTemplates += group.templates.length;
			}

			const stats: GenerationStats = {
				totalFiles: totalTemplates,
				createdFiles: 0, // 실제 생성 후 업데이트
				failedFiles: 0,
				skippedFiles: 0,
				results: []
			};

			PerformanceUtils.endTimer('getGenerationStats');

			return stats;
		} catch (error) {
			PerformanceUtils.endTimer('getGenerationStats');
			throw error;
		}
	}

	/**
	 * 향상된 통계 출력
	 */
	private printEnhancedStats(
		stats: GenerationStats & { performanceMetrics?: any }
	): void {
		TemplateProcessor.printStats(stats);

		if (stats.performanceMetrics) {
			console.log(`\n⚡ 성능 정보:`);
			console.log(
				`   총 소요 시간: ${stats.performanceMetrics.totalDuration.toFixed(
					2
				)}ms`
			);
			console.log(
				`   파일당 평균 시간: ${stats.performanceMetrics.averageFileTime.toFixed(
					2
				)}ms`
			);
			console.log(
				`   초당 파일 처리: ${stats.performanceMetrics.filesPerSecond.toFixed(
					1
				)}개`
			);
		}
	}

	/**
	 * 성능 메트릭 출력
	 */
	printPerformanceMetrics(): void {
		PerformanceUtils.printMetrics();
		PerformanceUtils.printMemoryUsage();
	}

	/**
	 * 성능 메트릭 초기화
	 */
	clearPerformanceMetrics(): void {
		PerformanceUtils.clearMetrics();
	}
}

// 유틸리티 클래스들도 export
export { FileSystemUtils } from './file-system-utils';
export { TemplateProcessor } from './template-processor';
export { TemplateEngine } from './template-engine';
export { PerformanceUtils } from './performance-utils';
export * from './template-config';
export * from './types';
