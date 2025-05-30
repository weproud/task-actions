import { YamlTemplate } from '../types';

export const VARS_BASE_TEMPLATE: YamlTemplate = {
	name: 'base/vars.yaml',
	description: '{{projectName}} environment variable configuration',
	content: {
		slack_webhook_url: '{{slackWebhookUrl}}',
		discord_webhook_url: '{{discordWebhookUrl}}',
		github_token: '{{githubToken}}',
		project: {
			name: '{{projectName}}',
			description: '{{projectDescription}}',
			author: '{{author}}',
			version: '{{version}}',
			repository: '{{repositoryUrl}}'
		},
		development: {
			branch_prefix: '{{branchPrefix}}',
			test_environment: '{{testEnvironment}}',
			complexity_level: '{{complexityLevel}}'
		}
	},
	enhancedprompt: `You are a configuration management specialist responsible for establishing secure, maintainable, and scalable environment variable and configuration management practices across development, staging, and production environments.

OBJECTIVE:
Create a comprehensive configuration management system that ensures secure handling of sensitive data, environment-specific settings, and maintainable project configurations while following security best practices and operational excellence.

DETAILED STEPS:
1. **Configuration Structure and Organization**:
   - Organize variables by environment and functional areas
   - Establish clear naming conventions for all configuration keys
   - Separate sensitive data from non-sensitive configuration
   - Create hierarchical configuration with inheritance patterns
   - Plan for configuration validation and type safety
   - Document all configuration options and their purposes

2. **Security and Secrets Management**:
   - Implement secure storage for API keys, tokens, and passwords
   - Use environment-specific encryption for sensitive data
   - Establish access controls and rotation policies for secrets
   - Implement secure configuration loading and validation
   - Plan for secrets auditing and compliance requirements
   - Use secure defaults and fail-safe configuration patterns

3. **Environment Management**:
   - Define clear separation between development, staging, and production
   - Implement environment-specific configuration overrides
   - Establish configuration deployment and rollback procedures
   - Plan for configuration monitoring and alerting
   - Create configuration backup and disaster recovery plans
   - Implement configuration change tracking and versioning

4. **Integration and Automation**:
   - Integrate with CI/CD pipelines for automated configuration deployment
   - Implement configuration validation in build processes
   - Set up automated testing for configuration changes
   - Plan for configuration drift detection and remediation
   - Create configuration documentation and change management processes

BEST PRACTICES:
- Never commit sensitive data to version control
- Use environment variables for runtime configuration
- Implement configuration validation and error handling
- Document all configuration options and dependencies
- Use secure defaults and principle of least privilege
- Plan for configuration scalability and maintainability

EXPECTED OUTCOME:
A secure, well-organized configuration management system that enables safe handling of environment variables, secrets, and project settings across all environments with proper security controls and operational procedures.`
};
