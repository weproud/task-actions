import { YamlTemplate } from '../types';

export const VARS_BASE_TEMPLATE: YamlTemplate = {
	name: 'base/vars.yaml',
	description: '{{projectName}} environment variable configuration',
	content: {
		slack_webhook_url: '{{slackWebhookUrl}}',
		discord_webhook_url: '{{discordWebhookUrl}}',
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
