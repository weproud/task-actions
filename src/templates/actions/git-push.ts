import { YamlTemplate } from '../types';

export const GIT_PUSH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/git-push.yaml',
	description: '로컬 변경사항을 원격 저장소에 푸시한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Git Push',
		description: '로컬 변경사항을 원격 저장소에 푸시한다',
		prompt: `현재 브랜치의 변경사항을 원격 저장소에 푸시하고, 필요시 upstream을 설정합니다.`
	}
};
