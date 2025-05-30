import { YamlTemplate } from '../types';

export const GIT_PUSH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-push.yaml',
	description: 'Push local changes to remote repository',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Push',
		description: 'Push local changes to remote repository',
		prompt: `Push changes from current branch to remote repository and set upstream if necessary.`
	}
};
