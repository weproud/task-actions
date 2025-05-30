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
		}, 'Load variables file');
	}

	/**
	 * Extract template variables from parsed YAML
	 */
	private static extractVariablesFromParsedYaml(
		parsed: Record<string, unknown>
	): Partial<TemplateVariables> {
		const variables: Partial<TemplateVariables> = {};

		// Extract project information
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

		// Extract Git-related settings
		const git = parsed.git as Record<string, unknown> | undefined;
		if (git) {
			if (typeof git.repositoryUrl === 'string') {
				variables.repositoryUrl = git.repositoryUrl;
			}
			if (typeof git.branchPrefix === 'string') {
				variables.branchPrefix = git.branchPrefix;
			}
		}

		// Extract environment settings
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

		// Check webhook settings at top level as well (new format)
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
	 * Legacy manual parsing method (for backward compatibility)
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
	 * YAML content validation
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
	 * Safe YAML parsing (with type checking)
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
	 * Convert YAML object to string
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
				`YAML serialization failed: ${
					error instanceof Error ? error.message : 'Unknown error'
				}`
			);
		}
	}
}
