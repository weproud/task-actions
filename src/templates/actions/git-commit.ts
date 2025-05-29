import { YamlTemplate } from '../types';

export const GIT_COMMIT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-commit.yaml',
	description: '변경사항을 Git에 커밋한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Commit',
		description: '변경사항을 Git에 커밋한다',
		prompt: `개발한 내용을 Git에 커밋합니다.

				다음 단계를 수행해주세요:
				1. **변경사항 확인**
				- git status로 변경된 파일들 확인
				- git diff로 변경 내용 검토
				- 불필요한 파일이 포함되지 않았는지 확인

				2. **스테이징**
				- 커밋할 파일들을 git add로 스테이징
				- .gitignore에 추가해야 할 파일들 확인
				- 민감한 정보가 포함되지 않았는지 검사

				3. **커밋 메시지 작성**
				- 의미 있고 명확한 커밋 메시지 작성
				- 컨벤션에 따른 형식 사용 (feat:, fix:, docs: 등)
				- 변경 사항의 이유와 내용을 간결하게 설명

				4. **커밋 실행**
				- git commit으로 변경사항 커밋
				- 커밋 결과 확인
				- 필요시 커밋 메시지 수정 안내

				프로젝트: {{projectName}}
				작성자: {{author}}`
	}
};
