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

Check package.json scripts first for test commands, and use the appropriate test framework for the project.`
	}
};
