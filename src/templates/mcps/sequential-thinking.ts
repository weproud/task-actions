import { YamlTemplate } from '../types';

export const SEQUENTIAL_THINKING_MCP_TEMPLATE: YamlTemplate = {
	name: 'mcps/sequential-thinking.yaml',
	description: '복잡한 문제 해결을 위한 단계적 사고 과정',
	content: {
		version: 1,
		kind: 'mcp',
		name: 'sequential-thinking',
		description: '복잡한 문제 해결을 위한 단계적 사고 과정',
		prompt: `복잡한 문제나 태스크 해결 시 sequential-thinking을 활용한다:

  1. 문제 분석
     - 문제를 작은 단위로 분해
     - 각 단계별 목표와 제약사항 파악
     - 의존성과 우선순위 정리

  2. 단계적 접근
     - 논리적 순서로 문제 해결
     - 각 단계의 결과를 다음 단계에 활용
     - 중간 검증 및 피드백 반영

  3. 반복적 개선
     - 초기 가설 설정 및 검증
     - 결과에 따른 접근 방식 조정
     - 최종 솔루션까지 반복 개선

  프로젝트: {{projectName}}
  복잡도 수준: {{complexityLevel}}`
	}
};
