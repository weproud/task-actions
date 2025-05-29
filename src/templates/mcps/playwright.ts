import { YamlTemplate } from '../types';

export const PLAYWRIGHT_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/playwright.yaml',
	description: 'Playwright를 통한 브라우저 자동화 및 테스트',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'playwright',
		description: 'Playwright를 통한 브라우저 자동화 및 테스트',
		prompt: `Playwright를 사용한 브라우저 자동화 및 E2E 테스트를 수행합니다. 사용자 시나리오 기반 테스트 작성, 크로스 브라우저 테스트, 성능 및 접근성 테스트를 포함합니다.`
	}
};
