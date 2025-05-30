import { YamlTemplate } from '../types';

export const CREATE_BRANCH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-branch.yaml',
	description: 'Create a new Git branch',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Branch',
		description: 'Create a new Git branch',
		prompt: `Generate appropriate branch name using {{branchPrefix}}/ prefix, create new branch from latest main/develop branch and checkout.`
	}
};
