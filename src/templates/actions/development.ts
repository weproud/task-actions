import { YamlTemplate } from '../types';

export const DEVELOPMENT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/development.yaml',
	description: '{{projectName}} 개발',
	content: {
		version: 1,
		kind: 'action',
		name: 'Development',
		description: '{{projectName}} 개발',
		prompt: '{{projectName}}의 task 내용을 개발한다'
	}
};
