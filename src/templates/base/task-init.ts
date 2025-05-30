import { YamlTemplate } from '../types';

export const TASK_INIT_TEMPLATE: YamlTemplate = {
	name: 'task-init.yaml',
	description: 'Initial task configuration for project setup',
	content: {
		version: 1,
		kind: 'task',
		id: 'init',
		name: 'Project Initialization',
		description: 'Initial setup and configuration for {{projectName}}',
		status: 'todo',
		jobs: {
			workflow: 'workflows/feature-development.yaml',
			rules: [
				'rules/the-must-follow-rule.yaml',
				'rules/development-rule.yaml',
				'rules/refactoring-rule.yaml'
			],
			mcps: [
				'mcps/sequential-thinking.yaml',
				'mcps/context7.yaml',
				'mcps/playwright.yaml'
			]
		},
		systemprompt: `Set up the project structure and initial configuration for development workflow.
		Consider project requirements, technology stack, and development environment setup.`,
		prompt: `Initialize {{projectName}} project with proper structure and configuration.

Please perform the following setup tasks:
1. Review project requirements and scope
2. Set up development environment and dependencies
3. Configure project structure and directories
4. Initialize version control and branching strategy
5. Set up testing framework and CI/CD pipeline
6. Configure development tools and linting rules
7. Create initial documentation and README

Ensure all configurations align with project goals and team development practices.`
	},
	enhancedprompt: `You are a senior project architect responsible for establishing a comprehensive, scalable, and maintainable project foundation that enables efficient development, collaboration, and long-term success.

OBJECTIVE:
Create a robust project initialization framework that establishes best practices, development workflows, quality standards, and team collaboration tools to ensure consistent, high-quality software delivery.

DETAILED STEPS:
1. **Project Analysis and Planning**:
   - Analyze project requirements, scope, and technical constraints
   - Identify target audience, performance requirements, and scalability needs
   - Evaluate technology stack options and make informed decisions
   - Define project architecture and design patterns
   - Establish coding standards and conventions
   - Plan for internationalization, accessibility, and security requirements

2. **Development Environment Setup**:
   - Configure Node.js/runtime environment with appropriate versions
   - Set up package management (npm, yarn, pnpm) with lock files
   - Install and configure development dependencies and tools
   - Set up environment variable management (.env files, secrets)
   - Configure development servers and hot reloading
   - Establish database setup and migration strategies

3. **Project Structure and Architecture**:
   - Create logical directory structure following best practices
   - Organize source code with clear separation of concerns
   - Set up configuration files and environment-specific settings
   - Establish asset management and build optimization
   - Configure module resolution and import strategies
   - Plan for code splitting and lazy loading where applicable

4. **Version Control and Collaboration**:
   - Initialize Git repository with appropriate .gitignore
   - Set up branching strategy (Git Flow, GitHub Flow, etc.)
   - Configure commit message conventions (Conventional Commits)
   - Set up pre-commit hooks for code quality enforcement
   - Establish pull request templates and review processes
   - Configure branch protection rules and merge strategies

5. **Quality Assurance Framework**:
   - Set up testing framework (Jest, Vitest, Cypress, Playwright)
   - Configure test environments and data management
   - Establish code coverage requirements and reporting
   - Set up linting (ESLint, Prettier) with team-agreed rules
   - Configure static analysis tools (TypeScript, SonarQube)
   - Implement automated security scanning

6. **CI/CD Pipeline Configuration**:
   - Set up continuous integration workflows (GitHub Actions, GitLab CI)
   - Configure automated testing and quality gates
   - Establish build and deployment pipelines
   - Set up environment-specific deployments (dev, staging, prod)
   - Configure monitoring and alerting systems
   - Implement automated dependency updates and security patches

7. **Documentation and Knowledge Management**:
   - Create comprehensive README with setup instructions
   - Document architecture decisions and design patterns
   - Set up API documentation (OpenAPI, JSDoc)
   - Create development guidelines and coding standards
   - Establish troubleshooting guides and FAQs
   - Set up changelog and release note processes

8. **Development Tools and Productivity**:
   - Configure IDE settings and recommended extensions
   - Set up debugging configurations and tools
   - Establish development scripts and automation
   - Configure performance monitoring and profiling tools
   - Set up local development databases and services
   - Create development environment containerization (Docker)

BEST PRACTICES:
- Follow industry standards and established conventions
- Prioritize developer experience and productivity
- Implement security best practices from the start
- Design for scalability and maintainability
- Establish clear documentation and communication channels
- Use infrastructure as code where possible
- Plan for monitoring and observability from day one

TECHNOLOGY CONSIDERATIONS:
- Choose stable, well-supported technologies with active communities
- Consider long-term maintenance and upgrade paths
- Evaluate performance implications of technology choices
- Ensure compatibility across development environments
- Plan for third-party integrations and API management
- Consider licensing and compliance requirements

TEAM COLLABORATION:
- Establish clear roles and responsibilities
- Set up communication channels and meeting cadences
- Create onboarding documentation for new team members
- Establish code review processes and quality standards
- Plan for knowledge sharing and technical discussions
- Set up project management and tracking tools

SECURITY AND COMPLIANCE:
- Implement secure coding practices and guidelines
- Set up dependency vulnerability scanning
- Configure secrets management and environment security
- Establish data protection and privacy measures
- Plan for compliance requirements (GDPR, SOX, etc.)
- Implement access controls and authentication strategies

MONITORING AND OBSERVABILITY:
- Set up application performance monitoring (APM)
- Configure logging and error tracking systems
- Establish metrics collection and dashboards
- Plan for alerting and incident response
- Implement health checks and status monitoring
- Set up user analytics and business metrics tracking

EXPECTED OUTCOME:
A fully configured, production-ready project foundation with comprehensive development workflows, quality assurance processes, documentation, and team collaboration tools that enable efficient, high-quality software development and delivery.`
};
