import { YamlTemplate } from '../types';

export const CREATE_PULL_REQUEST_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-pull-request.yaml',
	description: 'GitHub에 Pull Request를 생성한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Pull Request',
		description: 'GitHub에 Pull Request를 생성한다',
		prompt: `개발 완료된 기능에 대한 Pull Request를 생성합니다.

				다음 단계를 수행해주세요:
				1. **PR 생성 전 확인사항**
				- 모든 변경사항이 커밋되고 푸시되었는지 확인
				- 브랜치가 최신 상태인지 확인
				- CI/CD 파이프라인이 성공적으로 실행되었는지 확인

				2. **PR 정보 작성**
				- 명확하고 설명적인 PR 제목 작성
				- 변경사항에 대한 상세한 설명 작성
				- 관련 이슈 번호 연결 (있는 경우)
				- 스크린샷이나 데모 링크 첨부 (필요시)

				3. **리뷰어 및 라벨 설정**
				- 적절한 리뷰어 지정
				- 관련 라벨 추가
				- 마일스톤 설정 (해당하는 경우)

				4. **PR 생성 및 후속 작업**
				- Pull Request 생성
				- 팀에 리뷰 요청 알림
				- 추가 테스트나 문서 업데이트 필요 여부 확인

				프로젝트: {{projectName}}
				저장소: {{repositoryUrl}}
				작성자: {{author}}`
	}
};
