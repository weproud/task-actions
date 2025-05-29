import { YamlTemplate } from '../types';

export const DEVELOPMENT_RULE_TEMPLATE: YamlTemplate = {
	name: 'rules/development-rule.yaml',
	description: '{{projectName}} 개발 작업 시 따라야 할 규칙들',
	content: {
		version: 1,
		kind: 'rule',
		name: 'Development Rule',
		description: '{{projectName}} 개발 작업 시 따라야 할 규칙들',
		prompt: `{{projectName}} 개발 시 다음 규칙을 따르세요:
- TypeScript, ESLint, Prettier 사용으로 코드 품질 보장
- 의미있는 커밋 메시지와 {{branchPrefix}}/ prefix 브랜치 사용  
- Pull Request를 통한 코드 리뷰 필수
- 문서화(README, 주석, API 문서) 유지
- 복잡한 작업시 sequential-thinking, context7, playwright 활용
`
	}
};
