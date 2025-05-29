import { YamlTemplate } from '../types';

export const SEQUENTIAL_THINKING_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/sequential-thinking.yaml',
	description: '복잡한 문제 해결을 위한 단계적 사고 과정',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'sequential-thinking',
		description: '복잡한 문제 해결을 위한 단계적 사고 과정',
		prompt: `복잡한 문제나 태스크 해결 시 sequential-thinking을 활용합니다. 문제를 단계별로 분해하고, 논리적 순서로 접근하여 반복적으로 개선해나갑니다.`
	}
};
