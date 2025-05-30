import { YamlTemplate } from '../types';

export const GIT_COMMIT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-commit.yaml',
	description: 'Commit changes to Git',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Commit',
		description: 'Commit changes to Git',
		prompt: `Check changed files, stage them, and execute commit with meaningful commit message (using conventions like feat:, fix:, docs:, etc.).
`
	}
};
