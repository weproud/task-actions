import { YamlTemplate } from '../types';

export const CONTEXT7_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/context7.yaml',
	description: 'Context7을 통한 라이브러리 문서 검색',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'context7',
		description: 'Context7을 통한 라이브러리 문서 검색',
		prompt: `라이브러리나 프레임워크 사용 시 Context7을 활용합니다. 최신 버전의 공식 문서를 참조하여 정확한 구현과 베스트 프랙티스를 따릅니다.
`
	}
};
