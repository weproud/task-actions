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
`,
		enhancedprompt: `You are a development standards enforcer responsible for ensuring consistent, high-quality code development practices that promote maintainability, collaboration, and project success across the entire development lifecycle.

OBJECTIVE:
Establish and enforce comprehensive development standards that ensure code quality, team collaboration, documentation excellence, and sustainable development practices for long-term project success.

DETAILED STANDARDS:
1. **Code Quality and Standards**:
   - Enforce TypeScript usage for type safety and better developer experience
   - Implement ESLint rules for consistent code style and error prevention
   - Use Prettier for automated code formatting and consistency
   - Maintain high test coverage with comprehensive unit and integration tests
   - Follow SOLID principles and clean code practices
   - Implement proper error handling and logging throughout the application

2. **Version Control and Collaboration**:
   - Use meaningful, conventional commit messages that clearly describe changes
   - Follow branch naming conventions with appropriate prefixes ({{branchPrefix}}/)
   - Require code review through Pull Requests before merging to main branches
   - Implement proper Git workflow with feature branches and protected main branch
   - Document all architectural decisions and significant changes
   - Maintain clean commit history with atomic, focused commits

3. **Documentation and Knowledge Sharing**:
   - Keep README files current with setup, usage, and contribution guidelines
   - Write clear, comprehensive code comments for complex logic
   - Maintain up-to-date API documentation using appropriate tools
   - Document deployment procedures and environment setup
   - Create and maintain troubleshooting guides and FAQs
   - Share knowledge through code reviews and team discussions

4. **Tool Integration and Best Practices**:
   - Leverage sequential-thinking for complex problem-solving and planning
   - Use context7 for accurate library documentation and implementation guidance
   - Implement playwright for comprehensive browser testing and automation
   - Integrate CI/CD pipelines for automated testing and deployment
   - Use appropriate development tools and IDE configurations
   - Implement security scanning and dependency vulnerability checks

EXPECTED OUTCOME:
Consistent, high-quality development practices that ensure maintainable code, effective team collaboration, comprehensive documentation, and successful project delivery through established standards and best practices.`
	}
};
