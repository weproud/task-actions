import { YamlTemplate } from '../types';

export const CREATE_PULL_REQUEST_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-pull-request.yaml',
	description: 'Create Pull Request on GitHub',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Pull Request',
		description: 'Create Pull Request for completed feature development',
		prompt: `Write PR with clear title and description, set appropriate reviewers and labels to create Pull Request.`
	}
};
