import { YamlTemplate } from '../types';

export const DEVELOPMENT_RULE_TEMPLATE: YamlTemplate = {
	name: 'rules/development-rule.yaml',
	description: '{{projectName}} 개발 작업 시 따라야 할 규칙들',
	content: {
		version: 1,
		kind: 'rule',
		name: 'Development Rule',
		description: '{{projectName}} 개발 작업 시 따라야 할 규칙들',
		prompt: `{{projectName}} 개발 작업을 수행할 때는 다음 규칙을 따른다:
  
  1. 코드 품질
    - 타입스크립트를 사용하여 타입 안전성을 보장한다
    - ESLint와 Prettier를 사용하여 코드 스타일을 일관성 있게 유지한다
    - 단위 테스트를 작성하여 코드의 신뢰성을 보장한다

  2. Git 관리
    - 의미 있는 커밋 메시지를 작성한다
    - 기능별로 브랜치를 분리하여 작업한다 ({{branchPrefix}}/ prefix 사용)
    - Pull Request를 통해 코드 리뷰를 받는다

  3. 문서화
    - README.md 파일을 최신 상태로 유지한다
    - 복잡한 로직에는 주석을 추가한다
    - API 문서를 작성한다

  4. MCP 활용
     - 복잡한 task는 sequential-thinking을 사용한다
     - context7을 이용하여 최신 라이브러리를 참고한다
     - playwright를 활용하여 E2E 테스트를 작성한다

  5. 협업 규칙
     - 코드 리뷰는 24시간 내에 완료한다
     - 이슈 트래킹 시스템을 적극 활용한다
     - 정기적인 팀 회의에 참여한다

  프로젝트: {{projectName}}
  작성자: {{author}}
  버전: {{version}}`
	}
};
