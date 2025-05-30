import { YamlTemplate } from '../types';

export const DEVELOPMENT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/development.yaml',
	description: '{{projectName}} development',
	content: {
		version: 1,
		kind: 'action',
		name: 'Development',
		description: '{{projectName}} development',
		prompt: 'Develop the task content for {{projectName}}'
	}
};
