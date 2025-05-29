import { YamlTemplate } from '../types';

export const TASK_TEMPLATE: YamlTemplate = {
	name: 'tasks/task-template.yaml',
	description: '태스크 템플릿',
	content: {
		version: 1,
		kind: 'task',
		id: '{{taskId}}',
		name: '{{taskName}}',
		status: 'todo',
		jobs: {
			workflow: 'workflows/feature-development.yaml',
			rules: [
				'rules/development-rule.yaml'
			],
			mcps: [
				'mcps/sequential-thinking.yaml',
				'mcps/context7.yaml',
				'mcps/playwright.yaml'
			]
		},
		prompt: `{{taskDescription}}

  **요구사항:**
  1. 기능 설명
     - 구현할 기능의 목적과 범위를 명확히 기술
     - 사용자 스토리 또는 비즈니스 요구사항 포함

  2. 기술적 요구사항
     - 사용할 기술 스택 명시
     - 성능, 보안, 확장성 등의 비기능적 요구사항

  3. 구현 가이드
     - 파일 구조 및 아키텍처 설계
     - 주요 컴포넌트 및 모듈 설명
     - API 설계 (해당하는 경우)

  4. 테스트 요구사항
     - 단위 테스트 및 통합 테스트 계획
     - 테스트 커버리지 목표

  프로젝트: {{projectName}}
  담당자: {{author}}
  우선순위: {{priority}}
  예상 소요시간: {{estimatedHours}}시간`
	}
};
