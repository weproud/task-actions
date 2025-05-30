import { YamlTemplate } from '../types';

export const DEVELOPMENT_RULE_TEMPLATE: YamlTemplate = {
	name: 'rules/development-rule.yaml',
	description: 'Rules to follow when working on {{projectName}} development',
	content: {
		version: 1,
		kind: 'rule',
		name: 'Development Rule',
		description: 'Rules to follow when working on {{projectName}} development',
		prompt: `Follow these rules when developing {{projectName}}:
- Ensure code quality by using TypeScript, ESLint, and Prettier
- Use meaningful commit messages and {{branchPrefix}}/ prefix branches
- Code review through Pull Request is mandatory
- Maintain documentation (README, comments, API docs)
- Utilize sequential-thinking, context7, playwright for complex tasks
`
	}
};
