import { YamlTemplate } from '../types';

export const FEATURE_DEVELOPMENT_WORKFLOW_TEMPLATE: YamlTemplate = {
	name: 'workflows/feature-development.yaml',
	description: 'Perform {{projectName}} Feature Development work.',
	content: {
		version: 1,
		kind: 'workflow',
		name: 'Feature Development',
		description: 'Perform {{projectName}} Feature Development work.',
		jobs: {
			steps: [
				{
					name: 'Create a new feature branch',
					uses: 'actions/create-branch.yaml'
				},
				{
					name: 'Test',
					uses: 'actions/test.yaml'
				},
				{
					name: 'Commit the changes',
					uses: 'actions/git-commit.yaml'
				},
				{
					name: 'Push the changes',
					uses: 'actions/git-push.yaml'
				},
				{
					name: 'Create a pull request',
					uses: 'actions/create-pull-request.yaml'
				},
				{
					name: 'Send a message to Slack',
					uses: 'actions/send-message-slack.yaml'
				}
			]
		},
		prompt: `Perform tasks in steps order.`
	}
};
