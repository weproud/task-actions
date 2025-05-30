import { YamlTemplate } from '../types';

export const PLAYWRIGHT_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/playwright.yaml',
	description: 'Browser automation and testing with Playwright',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'playwright',
		description: 'Browser automation and testing with Playwright',
		prompt: `Perform browser automation and E2E testing using Playwright. Includes user scenario-based test writing, cross-browser testing, performance and accessibility testing.`
	}
};
