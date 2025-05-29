import { YamlTemplate } from '../types';

export const DEPLOY_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/deploy.yaml',
	description: '애플리케이션 배포',
	content: {
		version: 1,
		kind: 'action',
		name: 'Deploy',
		description: '애플리케이션을 배포합니다',
		prompt: `애플리케이션을 배포합니다.

다음 단계를 수행하세요:
1. 배포 환경 확인 (staging, production 등)
2. 빌드 및 테스트 완료 확인
3. 배포 스크립트 실행
4. 배포 후 헬스체크 수행
5. 롤백 계획 준비 (실패 시)

배포 환경 변수와 설정을 확인하고, CI/CD 파이프라인을 통해 안전한 배포를 수행하세요.`
	}
};
