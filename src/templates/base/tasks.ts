import { YamlTemplate } from '../types';

export const TASKS_BASE_TEMPLATE: YamlTemplate = {
	name: 'base/tasks.yaml',
	description: '{{projectName}} task list',
	content: {
		version: 1,
		name: '{{projectName}} task list',
		description: '{{projectDescription}}',
		tasks: [
			{
				id: '0000',
				status: 'todo'
			}
		]
	}
};
