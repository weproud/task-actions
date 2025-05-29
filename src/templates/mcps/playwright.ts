import { YamlTemplate } from '../types';

export const PLAYWRIGHT_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/playwright.yaml',
	description: 'Playwright를 통한 브라우저 자동화 및 테스트',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'playwright',
		description: 'Playwright를 통한 브라우저 자동화 및 테스트',
		prompt: `Playwright를 사용한 브라우저 자동화 및 E2E 테스트:

  1. 테스트 설계
     - 사용자 시나리오 기반 테스트 케이스 작성
     - 페이지 객체 모델 패턴 적용
     - 안정적이고 유지보수 가능한 테스트 코드 작성

  2. 브라우저 자동화
     - 크로스 브라우저 테스트 지원
     - 모바일 및 데스크톱 환경 테스트
     - 스크린샷 및 비디오 녹화 활용

  3. 성능 및 접근성
     - 페이지 로딩 성능 측정
     - 접근성 테스트 수행
     - 네트워크 조건 시뮬레이션

  프로젝트: {{projectName}}
  테스트 환경: {{testEnvironment}}`
	}
};
