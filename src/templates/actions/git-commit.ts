import { YamlTemplate } from '../types';

export const GIT_COMMIT_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-commit.yaml',
	description: '변경사항을 Git에 커밋한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Commit',
		description: '변경사항을 Git에 커밋한다',
		prompt: `변경된 파일들을 확인하고 스테이징한 후, 의미 있는 커밋 메시지(feat:, fix:, docs: 등 컨벤션 사용)와 함께 커밋을 실행합니다.
`
	}
};
