import { YamlTemplate } from '../types';

export const TEST_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/test.yaml',
	description: '프로젝트 테스트 실행',
	content: {
		version: 1,
		kind: 'action',
		name: 'Test',
		description: '프로젝트의 테스트를 실행합니다',
		prompt: `프로젝트의 테스트를 실행합니다.

다음 단계를 수행하세요:
1. 테스트 환경 설정 확인
2. 패키지 의존성 설치 확인
3. 단위 테스트 실행
4. 통합 테스트 실행 (있는 경우)
5. 테스트 결과 보고
6. 테스트 실패 시 원인 분석 및 해결 방안 제시

테스트 명령어는 package.json의 scripts를 우선 확인하고, 프로젝트에 맞는 테스트 프레임워크를 사용하세요.`
	}
};
