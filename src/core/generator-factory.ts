import * as path from 'path';
import { YamlGenerator, TemplateVariables, GeneratorOptions } from '../generator';

/**
 * YamlGenerator 인스턴스 생성을 위한 팩토리 클래스
 * 중복된 생성 로직을 통합하고 일관된 설정을 제공
 */
export class GeneratorFactory {
	private static defaultTemplateDir = path.join(__dirname, '../templates');

	/**
	 * 기본 설정으로 YamlGenerator 인스턴스 생성
	 */
	static createGenerator(
		outputDir: string,
		variables: TemplateVariables,
		overwrite: boolean = false
	): YamlGenerator {
		const options: GeneratorOptions = {
			outputDir,
			templateDir: this.defaultTemplateDir,
			variables,
			overwrite
		};

		return new YamlGenerator(options);
	}

	/**
	 * 현재 디렉토리를 기준으로 YamlGenerator 인스턴스 생성
	 */
	static createGeneratorForCurrentDir(
		variables: TemplateVariables,
		overwrite: boolean = false
	): YamlGenerator {
		return this.createGenerator(process.cwd(), variables, overwrite);
	}

	/**
	 * 커스텀 옵션으로 YamlGenerator 인스턴스 생성
	 */
	static createGeneratorWithOptions(options: GeneratorOptions): YamlGenerator {
		// 기본 템플릿 디렉토리 설정 (옵션에 없는 경우)
		if (!options.templateDir) {
			options.templateDir = this.defaultTemplateDir;
		}

		return new YamlGenerator(options);
	}

	/**
	 * 기본 템플릿 디렉토리 경로 설정
	 */
	static setDefaultTemplateDir(templateDir: string): void {
		this.defaultTemplateDir = templateDir;
	}

	/**
	 * 기본 템플릿 디렉토리 경로 가져오기
	 */
	static getDefaultTemplateDir(): string {
		return this.defaultTemplateDir;
	}
}
