import * as yaml from 'js-yaml';
import { TemplateVariables } from '../generator/types';
import { FileSystemUtils } from '../generator';
import { YAML_PATTERNS } from './constants';
import { ErrorHandler } from './error-handler';

/**
 * YAML 파싱 전용 유틸리티 클래스
 */
export class YamlParser {
	/**
	 * vars.yaml 파일에서 프로젝트 변수를 안전하게 로드
	 */
	static async loadVarsFromFile(
		filePath: string
	): Promise<Partial<TemplateVariables> | null> {
		if (!FileSystemUtils.fileExists(filePath)) {
			return null;
		}

		return ErrorHandler.safeExecute(async () => {
			const content = FileSystemUtils.readFile(filePath);
			const parsed = yaml.load(content) as Record<string, unknown>;

			return this.extractVariablesFromParsedYaml(parsed);
		}, '변수 파일 로드');
	}

	/**
	 * 파싱된 YAML에서 템플릿 변수 추출
	 */
	private static extractVariablesFromParsedYaml(
		parsed: Record<string, unknown>
	): Partial<TemplateVariables> {
		const variables: Partial<TemplateVariables> = {};

		// 프로젝트 정보 추출
		const project = parsed.project as Record<string, unknown> | undefined;
		if (project) {
			if (typeof project.name === 'string') {
				variables.projectName = project.name;
			}
			if (typeof project.description === 'string') {
				variables.projectDescription = project.description;
			}
			if (typeof project.author === 'string') {
				variables.author = project.author;
			}
			if (typeof project.version === 'string') {
				variables.version = project.version;
			}
		}

		// Git 관련 설정 추출
		const git = parsed.git as Record<string, unknown> | undefined;
		if (git) {
			if (typeof git.repositoryUrl === 'string') {
				variables.repositoryUrl = git.repositoryUrl;
			}
			if (typeof git.branchPrefix === 'string') {
				variables.branchPrefix = git.branchPrefix;
			}
		}

		// 환경 설정 추출
		const env = parsed.environment as Record<string, unknown> | undefined;
		if (env) {
			if (typeof env.slackWebhookUrl === 'string') {
				variables.slackWebhookUrl = env.slackWebhookUrl;
			}
			if (typeof env.discordWebhookUrl === 'string') {
				variables.discordWebhookUrl = env.discordWebhookUrl;
			}
			if (typeof env.githubToken === 'string') {
				variables.githubToken = env.githubToken;
			}
		}

		// 최상위 레벨에서도 webhook 설정 확인 (새로운 형식)
		if (typeof parsed.slack_webhook_url === 'string') {
			variables.slackWebhookUrl = parsed.slack_webhook_url;
		}
		if (typeof parsed.discord_webhook_url === 'string') {
			variables.discordWebhookUrl = parsed.discord_webhook_url;
		}
		if (typeof parsed.github_token === 'string') {
			variables.githubToken = parsed.github_token;
		}

		return variables;
	}

	/**
	 * 레거시 수동 파싱 방식 (하위 호환성용)
	 */
	static extractVariablesFromText(content: string): Partial<TemplateVariables> {
		const variables: Partial<TemplateVariables> = {};

		const matches = {
			projectName: content.match(YAML_PATTERNS.PROJECT_NAME),
			author: content.match(YAML_PATTERNS.PROJECT_AUTHOR),
			version: content.match(YAML_PATTERNS.PROJECT_VERSION)
		};

		if (matches.projectName) {
			variables.projectName = matches.projectName[1].trim();
		}
		if (matches.author) {
			variables.author = matches.author[1].trim();
		}
		if (matches.version) {
			variables.version = matches.version[1].trim();
		}

		return variables;
	}

	/**
	 * YAML 콘텐츠 검증
	 */
	static validateYamlContent(content: string): {
		isValid: boolean;
		error?: string;
	} {
		try {
			yaml.load(content);
			return { isValid: true };
		} catch (error) {
			return {
				isValid: false,
				error: error instanceof Error ? error.message : 'Unknown YAML error'
			};
		}
	}

	/**
	 * 안전한 YAML 파싱 (타입 체크 포함)
	 */
	static safeParse<T = unknown>(content: string): T | null {
		try {
			const result = yaml.load(content);
			return result as T;
		} catch {
			return null;
		}
	}

	/**
	 * YAML 객체를 문자열로 변환
	 */
	static stringify(obj: unknown): string {
		try {
			return yaml.dump(obj, {
				indent: 2,
				lineWidth: 120,
				noRefs: true,
				quotingType: '"',
				forceQuotes: false
			});
		} catch (error) {
			throw new Error(
				`YAML 직렬화 실패: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}
}
