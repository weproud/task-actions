import * as fs from 'fs';
import * as path from 'path';
import { TemplateVariables } from './types';

/**
 * 간단한 템플릿 엔진
 * {{variable}} 형태의 플레이스홀더를 실제 값으로 치환
 */
export class TemplateEngine {
	/**
	 * 템플릿 문자열에서 변수를 치환
	 * @param template 템플릿 문자열
	 * @param variables 치환할 변수들
	 * @returns 치환된 문자열
	 */
	static render(template: string, variables: TemplateVariables): string {
		if (!template) {
			throw new Error('템플릿이 제공되지 않았습니다.');
		}

		if (!variables) {
			throw new Error('템플릿 변수가 제공되지 않았습니다.');
		}

		let result = template;

		// {{variable}} 패턴을 찾아서 치환
		const variablePattern = /\{\{(\s*[\w.]+\s*)\}\}/g;

		result = result.replace(variablePattern, (match, variableName) => {
			const trimmedName = variableName.trim();

			// 중첩된 객체 속성 지원 (예: user.name)
			const value = this.getNestedValue(variables, trimmedName);

			if (value !== undefined && value !== null) {
				return String(value);
			}

			// 변수가 없으면 원본 유지 (개발 시 디버깅용)
			console.warn(`Warning: Template variable '${trimmedName}' not found`);
			return match;
		});

		return result;
	}

	/**
	 * 중첩된 객체에서 값 가져오기
	 * @param obj 객체
	 * @param path 경로 (예: "user.name")
	 * @returns 값 또는 undefined
	 */
	private static getNestedValue(obj: any, path: string): any {
		if (!obj || !path) {
			return undefined;
		}

		try {
			return path.split('.').reduce((current, key) => {
				return current && current[key] !== undefined ? current[key] : undefined;
			}, obj);
		} catch {
			return undefined;
		}
	}

	/**
	 * 템플릿 파일을 읽고 변수를 치환하여 결과 반환
	 * @param templatePath 템플릿 파일 경로
	 * @param variables 치환할 변수들
	 * @returns 치환된 내용
	 */
	static renderFile(
		templatePath: string,
		variables: TemplateVariables
	): string {
		if (!templatePath) {
			throw new Error('템플릿 파일 경로가 제공되지 않았습니다.');
		}

		if (!fs.existsSync(templatePath)) {
			throw new Error(`Template file not found: ${templatePath}`);
		}

		try {
			const template = fs.readFileSync(templatePath, 'utf8');
			return this.render(template, variables);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`템플릿 파일 읽기 실패 (${templatePath}): ${errorMessage}`
			);
		}
	}

	/**
	 * 템플릿을 렌더링하고 파일로 저장
	 * @param templatePath 템플릿 파일 경로
	 * @param outputPath 출력 파일 경로
	 * @param variables 치환할 변수들
	 * @param overwrite 덮어쓰기 여부
	 */
	static renderToFile(
		templatePath: string,
		outputPath: string,
		variables: TemplateVariables,
		overwrite: boolean = false
	): void {
		if (!outputPath) {
			throw new Error('출력 파일 경로가 제공되지 않았습니다.');
		}

		// 출력 파일이 이미 존재하고 덮어쓰기가 비활성화된 경우
		if (fs.existsSync(outputPath) && !overwrite) {
			console.log(`   - ${outputPath} (이미 존재함)`);
			return;
		}

		// 출력 디렉토리 생성
		const outputDir = path.dirname(outputPath);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		try {
			// 템플릿 렌더링 및 파일 저장
			const content = this.renderFile(templatePath, variables);
			fs.writeFileSync(outputPath, content, 'utf8');

			console.log(`   ✓ ${outputPath}`);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(`   ✗ ${outputPath} - 오류: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * 템플릿에서 사용된 변수 목록 추출
	 * @param template 템플릿 문자열
	 * @returns 변수 이름 배열
	 */
	static extractVariables(template: string): string[] {
		if (!template) {
			return [];
		}

		const variablePattern = /\{\{(\s*[\w.]+\s*)\}\}/g;
		const variables: string[] = [];
		let match;

		try {
			while ((match = variablePattern.exec(template)) !== null) {
				const variableName = match[1].trim();
				if (!variables.includes(variableName)) {
					variables.push(variableName);
				}
			}
		} catch {
			console.warn('템플릿에서 변수 추출 중 오류가 발생했습니다.');
		}

		return variables;
	}

	/**
	 * 템플릿 파일에서 사용된 변수 목록 추출
	 * @param templatePath 템플릿 파일 경로
	 * @returns 변수 이름 배열
	 */
	static extractVariablesFromFile(templatePath: string): string[] {
		if (!templatePath) {
			return [];
		}

		if (!fs.existsSync(templatePath)) {
			throw new Error(`Template file not found: ${templatePath}`);
		}

		try {
			const template = fs.readFileSync(templatePath, 'utf8');
			return this.extractVariables(template);
		} catch (error) {
			console.warn(`템플릿 파일에서 변수 추출 실패 (${templatePath}):`, error);
			return [];
		}
	}

	/**
	 * 템플릿 유효성 검사
	 * @param template 템플릿 문자열
	 * @returns 유효성 여부
	 */
	static validateTemplate(template: string): boolean {
		if (!template || typeof template !== 'string') {
			return false;
		}

		try {
			// 기본적인 구문 검사
			const variables = this.extractVariables(template);

			// 중괄호 짝이 맞는지 확인
			const openBraces = (template.match(/\{\{/g) || []).length;
			const closeBraces = (template.match(/\}\}/g) || []).length;

			return openBraces === closeBraces;
		} catch {
			return false;
		}
	}

	/**
	 * 템플릿 파일 유효성 검사
	 * @param templatePath 템플릿 파일 경로
	 * @returns 유효성 여부
	 */
	static validateTemplateFile(templatePath: string): boolean {
		try {
			if (!fs.existsSync(templatePath)) {
				return false;
			}

			const template = fs.readFileSync(templatePath, 'utf8');
			return this.validateTemplate(template);
		} catch {
			return false;
		}
	}

	/**
	 * 변수 치환 결과 미리보기
	 * @param template 템플릿 문자열
	 * @param variables 치환할 변수들
	 * @returns 치환될 변수들의 맵
	 */
	static previewSubstitutions(
		template: string,
		variables: TemplateVariables
	): Record<string, string> {
		const result: Record<string, string> = {};
		const templateVariables = this.extractVariables(template);

		for (const variableName of templateVariables) {
			const value = this.getNestedValue(variables, variableName);
			result[variableName] =
				value !== undefined ? String(value) : '<undefined>';
		}

		return result;
	}
}
