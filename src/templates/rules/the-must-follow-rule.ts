import { YamlTemplate } from '../types';

export const THE_MUST_FOLLOW_RULE_TEMPLATE: YamlTemplate = {
	name: 'rules/the-must-follow-rule.yaml',
	description: 'The Must Follow Rule',
	content: {
		version: 1,
		kind: 'rule',
		name: 'The Must Follow Rule',
		description: 'The Must Follow Rule',
		prompt: `Please do what you're told
`
	}
};
