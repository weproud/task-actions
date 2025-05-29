import { YamlTemplate } from '../types';

export const CREATE_BRANCH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-branch.yaml',
	description: '새로운 Git 브랜치를 생성한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Branch',
		description: '새로운 Git 브랜치를 생성한다',
		prompt: `새로운 기능 개발을 위한 Git 브랜치를 생성합니다.

				다음 단계를 수행해주세요:
				1. **브랜치 이름 결정**
				- 브랜치 이름을 입력받거나 자동으로 생성
				- 네이밍 컨벤션을 따라 적절한 prefix 적용 ({{branchPrefix}}/, bugfix/, hotfix/ 등)
				- 특수문자 제거 및 소문자 변환

				2. **브랜치 생성 전 확인사항**
				- 현재 브랜치와 작업 디렉토리 상태 확인
				- 커밋되지 않은 변경사항이 있는지 검사
				- 원격 저장소와 동기화 상태 확인

				3. **브랜치 생성 및 체크아웃**
				- 최신 main/develop 브랜치에서 새 브랜치 생성
				- 생성된 브랜치로 자동 체크아웃
				- 브랜치 생성 결과 확인 및 피드백 제공

				4. **후속 작업 안내**
				- 새 브랜치에서의 작업 가이드라인 제시
				- 첫 커밋 메시지 제안
				- 원격 저장소 푸시 방법 안내

				브랜치 이름이 제공되지 않은 경우, 작업 내용을 바탕으로 적절한 이름을 제안해주세요.`
	}
};
