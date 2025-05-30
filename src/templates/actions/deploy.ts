import { YamlTemplate } from '../types';

export const DEPLOY_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/deploy.yaml',
	description: 'Application deployment',
	content: {
		version: 1,
		kind: 'action',
		name: 'Deploy',
		description: 'Deploy application',
		prompt: `Deploy application.

Please perform the following steps:
1. Check deployment environment (staging, production, etc.)
2. Verify build and test completion
3. Execute deployment script
4. Perform health check after deployment
5. Prepare rollback plan (in case of failure)

Check deployment environment variables and configuration, and perform safe deployment through CI/CD pipeline.`
	},
	enhancedprompt: `You are responsible for executing a safe, reliable, and monitored application deployment following industry best practices and ensuring zero-downtime deployment.

OBJECTIVE:
Deploy the application to the target environment with comprehensive validation, monitoring, and rollback capabilities to ensure service reliability and minimal risk.

DETAILED STEPS:
1. **Pre-Deployment Validation**:
   - Verify target environment (development, staging, production)
   - Confirm all required environment variables are set
   - Validate configuration files and secrets are properly configured
   - Check resource availability (CPU, memory, disk space, network)
   - Ensure database migrations are ready and tested
   - Verify external service dependencies are accessible

2. **Build and Test Verification**:
   - Confirm all CI/CD pipeline stages have passed successfully
   - Validate unit tests, integration tests, and end-to-end tests
   - Check code quality metrics and security scans
   - Verify artifact integrity and digital signatures
   - Ensure no critical vulnerabilities in dependencies
   - Validate performance benchmarks meet requirements

3. **Deployment Strategy Selection**:
   - Choose appropriate deployment strategy (blue-green, rolling, canary)
   - Configure load balancer and traffic routing
   - Set up monitoring and alerting for the deployment
   - Prepare feature flags for gradual rollout if applicable
   - Plan for database schema changes and data migrations

4. **Deployment Execution**:
   - Create deployment snapshot/backup of current state
   - Execute deployment scripts in the correct sequence
   - Monitor deployment progress and system metrics
   - Validate each deployment step before proceeding
   - Implement graceful shutdown of old instances
   - Ensure new instances are properly initialized

5. **Post-Deployment Validation**:
   - Perform comprehensive health checks on all services
   - Validate API endpoints and critical user journeys
   - Check database connectivity and data integrity
   - Monitor application logs for errors or warnings
   - Verify performance metrics are within acceptable ranges
   - Test integration with external services

6. **Monitoring and Alerting Setup**:
   - Configure application performance monitoring (APM)
   - Set up error tracking and logging aggregation
   - Establish alerting thresholds for key metrics
   - Monitor user experience and business metrics
   - Track deployment success/failure rates

BEST PRACTICES:
- Always deploy during low-traffic periods when possible
- Use infrastructure as code for consistent environments
- Implement automated rollback triggers for critical failures
- Maintain deployment logs and audit trails
- Use feature flags to control new functionality exposure
- Perform gradual traffic shifting for production deployments
- Keep deployment artifacts versioned and immutable

ERROR HANDLING AND ROLLBACK:
- **Automatic Rollback Triggers**:
  - High error rates (>5% increase from baseline)
  - Response time degradation (>50% increase)
  - Critical service failures or timeouts
  - Database connection failures
  - Memory leaks or resource exhaustion

- **Manual Rollback Process**:
  - Stop traffic to new deployment
  - Restore previous application version
  - Revert database migrations if necessary
  - Clear caches and restart services
  - Validate rollback success with health checks
  - Document incident and lessons learned

SECURITY CONSIDERATIONS:
- Validate all security configurations are applied
- Ensure SSL/TLS certificates are valid and current
- Check that security headers are properly configured
- Verify access controls and authentication systems
- Scan for exposed sensitive information or credentials

COMPLIANCE AND DOCUMENTATION:
- Document deployment steps and decisions made
- Record deployment time, version, and responsible person
- Update change management systems
- Notify stakeholders of deployment status
- Update runbooks and operational documentation

EXPECTED OUTCOME:
A successful deployment with the new application version running stably in the target environment, all health checks passing, monitoring systems active, and rollback plan ready for immediate execution if needed.`
};
