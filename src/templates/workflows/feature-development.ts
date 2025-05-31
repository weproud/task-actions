import { YamlTemplate } from '../types';

export const FEATURE_DEVELOPMENT_WORKFLOW_TEMPLATE: YamlTemplate = {
	name: 'workflows/feature-development.yaml',
	description: 'Perform {{projectName}} Feature Development work.',
	content: {
		version: 1,
		kind: 'workflow',
		name: 'Feature Development',
		description: 'Perform {{projectName}} Feature Development work.',
		jobs: {
			steps: [
				{
					name: 'Create a new feature branch',
					uses: 'actions/create-branch.yaml'
				},
				{
					name: 'Test',
					uses: 'actions/test.yaml'
				},
				{
					name: 'Commit the changes',
					uses: 'actions/git-commit.yaml'
				},
				{
					name: 'Push the changes',
					uses: 'actions/git-push.yaml'
				},
				{
					name: 'Create a pull request',
					uses: 'actions/create-pull-request.yaml'
				},
				{
					name: 'Send a message to Slack',
					uses: 'actions/send-message-slack.yaml'
				}
			]
		},
		prompt: `Perform tasks in steps order.`,
		enhancedprompt: `You are a workflow orchestration specialist responsible for managing comprehensive feature development processes that ensure high-quality deliverables through systematic execution of development, testing, and deployment procedures.

OBJECTIVE:
Execute a complete feature development workflow that encompasses planning, implementation, testing, review, and deployment while maintaining code quality, team collaboration, and project delivery standards.

DETAILED STEPS:
1. **Feature Planning and Preparation**:
   - Analyze feature requirements and technical specifications
   - Plan development approach and architecture decisions
   - Create feature branch with appropriate naming conventions
   - Set up development environment and dependencies
   - Coordinate with team members and stakeholders

2. **Development and Implementation**:
   - Implement feature functionality following coding standards
   - Write comprehensive tests (unit, integration, e2e)
   - Ensure code quality through linting and static analysis
   - Document code changes and API modifications
   - Handle error cases and edge scenarios

3. **Quality Assurance and Testing**:
   - Execute comprehensive test suites
   - Perform manual testing of critical user journeys
   - Validate performance and security requirements
   - Check accessibility and cross-browser compatibility
   - Verify integration with existing systems

4. **Code Review and Collaboration**:
   - Commit changes with clear, conventional commit messages
   - Push code to remote repository with proper branch management
   - Create detailed pull request with comprehensive description
   - Address code review feedback and suggestions
   - Ensure all CI/CD checks pass successfully

5. **Communication and Documentation**:
   - Send progress updates to team via Slack/Discord
   - Update project documentation and changelogs
   - Communicate any breaking changes or migration needs
   - Share demo links or screenshots for visual features
   - Document lessons learned and improvement opportunities

BEST PRACTICES:
- Follow established development workflows and team conventions
- Maintain clear communication throughout the development process
- Ensure comprehensive testing before requesting review
- Document decisions and trade-offs for future reference
- Collaborate effectively with team members and stakeholders

EXPECTED OUTCOME:
Successfully delivered feature with high code quality, comprehensive testing, proper documentation, and effective team communication throughout the development lifecycle.`
	}
};
