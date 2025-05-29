import { YamlTemplate } from '../types';

export const VARS_BASE_TEMPLATE: YamlTemplate = {
	name: 'base/vars.yaml',
	description: '{{projectName}} 환경 변수 설정',
	content: {
		slack_hook_url: '{{slackHookUrl}}',
		discord_hook_url: '{{discordHookUrl}}',
		github_token: '{{githubToken}}',
		project: {
			name: '{{projectName}}',
			description: '{{projectDescription}}',
			author: '{{author}}',
			version: '{{version}}',
			repository: '{{repositoryUrl}}'
		},
		development: {
			branch_prefix: '{{branchPrefix}}',
			test_environment: '{{testEnvironment}}',
			complexity_level: '{{complexityLevel}}'
		}
	}
};
