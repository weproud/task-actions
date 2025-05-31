import { YamlTemplate } from '../types';

export const TEST_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/test.yaml',
	description: 'Execute project tests',
	content: {
		version: 1,
		kind: 'action',
		name: 'Test',
		description: 'Execute project tests',
		prompt: `Execute project tests.

Please perform the following steps:
1. Check test environment configuration
2. Verify package dependencies installation
3. Run unit tests
4. Run integration tests (if available)
5. Report test results
6. Analyze causes and provide solutions for test failures

Check package.json scripts first for test commands, and use the appropriate test framework for the project.`,
		enhancedprompt: `You are responsible for executing comprehensive test suites to ensure code quality, functionality, and reliability while providing detailed analysis of test results and actionable recommendations for improvements.

OBJECTIVE:
Execute all relevant tests (unit, integration, end-to-end) systematically, analyze results thoroughly, and provide clear feedback on code quality, coverage, and potential issues that need attention.

DETAILED STEPS:
1. **Test Environment Setup**:
   - Verify Node.js/runtime version compatibility
   - Check that all dependencies are installed (npm install, yarn install)
   - Validate test configuration files (jest.config.js, vitest.config.ts, etc.)
   - Ensure test databases and external services are available
   - Set up environment variables required for testing
   - Clear any cached test results or artifacts

2. **Test Discovery and Planning**:
   - Examine package.json for available test scripts
   - Identify test frameworks in use (Jest, Vitest, Mocha, Cypress, etc.)
   - Locate test files and understand test structure
   - Check for different test types (unit, integration, e2e)
   - Identify test configuration and setup files
   - Review test coverage requirements and thresholds

3. **Test Execution Strategy**:
   - **Unit Tests**: Test individual functions, classes, and components
   - **Integration Tests**: Test interactions between modules/services
   - **End-to-End Tests**: Test complete user workflows
   - **Performance Tests**: Validate response times and resource usage
   - **Security Tests**: Check for vulnerabilities and security issues
   - **Regression Tests**: Ensure existing functionality still works

4. **Test Execution Process**:
   - Run tests in appropriate order (unit → integration → e2e)
   - Execute tests with appropriate flags (--coverage, --watch, --verbose)
   - Monitor test execution progress and resource usage
   - Capture detailed output and error messages
   - Handle test timeouts and hanging processes
   - Generate test reports and coverage data

5. **Result Analysis and Reporting**:
   - **Test Results Summary**:
     - Total tests run, passed, failed, skipped
     - Test execution time and performance metrics
     - Code coverage percentages by file/function
     - Identification of flaky or unstable tests

   - **Failure Analysis**:
     - Categorize failures (syntax, logic, environment, dependency)
     - Provide stack traces and error context
     - Identify root causes and affected components
     - Suggest specific fixes for each failure type

   - **Coverage Analysis**:
     - Highlight uncovered code paths
     - Identify critical functions without tests
     - Suggest areas needing additional test coverage
     - Report on coverage trends and improvements

6. **Quality Assessment**:
   - Evaluate test quality and maintainability
   - Check for test code smells and anti-patterns
   - Assess test isolation and independence
   - Review test data management and cleanup
   - Validate test assertions are meaningful and specific

BEST PRACTICES:
- Run tests in isolated environments to avoid side effects
- Use appropriate test data and mocking strategies
- Ensure tests are deterministic and repeatable
- Maintain fast feedback loops with quick-running unit tests
- Use descriptive test names that explain the expected behavior
- Keep tests simple, focused, and easy to understand
- Regularly update and maintain test suites

FRAMEWORK-SPECIFIC CONSIDERATIONS:
- **Jest**: Use --coverage, --watch, --detectOpenHandles flags appropriately
- **Vitest**: Leverage fast HMR and native ES modules support
- **Cypress**: Handle browser automation and visual testing
- **Playwright**: Manage multiple browser contexts and parallel execution
- **Mocha/Chai**: Configure reporters and assertion libraries properly

ERROR HANDLING AND TROUBLESHOOTING:
- **Dependency Issues**:
  - Reinstall node_modules if package conflicts exist
  - Check for version incompatibilities
  - Verify peer dependencies are satisfied

- **Environment Problems**:
  - Validate environment variables and configuration
  - Check database connections and external service availability
  - Ensure proper permissions and file access

- **Test Failures**:
  - Isolate failing tests to understand scope
  - Check for timing issues and race conditions
  - Validate test data and mock configurations
  - Review recent code changes that might affect tests

- **Performance Issues**:
  - Identify slow-running tests and optimize
  - Check for memory leaks in test processes
  - Optimize test parallelization and resource usage

CONTINUOUS IMPROVEMENT:
- Track test metrics over time (coverage, execution time, failure rates)
- Identify and eliminate flaky tests
- Refactor tests for better maintainability
- Add tests for new features and bug fixes
- Review and update test strategies regularly

REPORTING AND COMMUNICATION:
- Generate comprehensive test reports with visual coverage maps
- Provide actionable recommendations for improving test coverage
- Document test failures with clear reproduction steps
- Communicate test results to relevant stakeholders
- Update documentation based on test findings

EXPECTED OUTCOME:
Complete test execution with detailed results, comprehensive coverage analysis, clear identification of issues with specific solutions, and actionable recommendations for improving code quality and test coverage.`
	}
};
