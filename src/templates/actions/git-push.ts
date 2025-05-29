import { YamlTemplate } from '../types';

export const GIT_PUSH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-push.yaml',
	description: '로컬 변경사항을 원격 저장소에 푸시한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Push',
		description: '로컬 변경사항을 원격 저장소에 푸시한다',
		prompt: `로컬 커밋을 원격 저장소에 푸시합니다.

				다음 단계를 수행해주세요:
				1. **푸시 전 확인사항**
				- 현재 브랜치 확인
				- 커밋되지 않은 변경사항이 없는지 확인
				- 원격 저장소 상태 확인

				2. **원격 저장소 동기화**
				- git fetch로 원격 저장소 최신 정보 가져오기
				- 충돌 가능성 확인
				- 필요시 rebase 또는 merge 수행

				3. **푸시 실행**
				- git push로 변경사항 푸시
				- 첫 푸시인 경우 upstream 설정
				- 푸시 결과 확인

				4. **후속 작업**
				- 원격 브랜치 생성 확인
				- Pull Request 생성 가능 여부 안내
				- CI/CD 파이프라인 실행 상태 확인

				저장소: {{repositoryUrl}}
				브랜치 prefix: {{branchPrefix}}`
	}
};
