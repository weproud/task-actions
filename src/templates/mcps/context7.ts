import { YamlTemplate } from '../types';

export const CONTEXT7_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/context7.yaml',
	description: 'Context7을 통한 라이브러리 문서 검색',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'context7',
		description: 'Context7을 통한 라이브러리 문서 검색',
		prompt: `라이브러리나 프레임워크 사용 시 Context7을 활용한다:

  1. 정확한 문서 검색
     - 최신 버전의 공식 문서를 참조한다
     - 예제 코드와 베스트 프랙티스를 확인한다
     - API 레퍼런스를 정확히 파악한다

  2. 구현 가이드
     - 공식 문서의 가이드라인을 따른다
     - 권장되는 패턴과 구조를 사용한다
     - 보안과 성능을 고려한다

  프로젝트: {{projectName}}`
	}
};
