import { YamlTemplate } from '../types';

export const VARS_BASE_TEMPLATE: YamlTemplate = {
	name: 'base/vars.yaml',
	description: '{{projectName}} environment variable configuration',
	content: {
		project: {
			name: '{{projectName}}',
			description: '{{projectDescription}}'
		},
		development: {
			branch_prefix: '{{branchPrefix}}',
			test_environment: '{{testEnvironment}}',
			use_enhanced_prompt: true
		},
		slack_webhook_url: '{{slackWebhookUrl}}',
		discord_webhook_url: '{{discordWebhookUrl}}',
		github_token: '{{githubToken}}'
	}
};
