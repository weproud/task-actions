import { YamlTemplate } from '../types';

export const CREATE_PULL_REQUEST_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-pull-request.yaml',
	description: 'GitHub에 Pull Request를 생성한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Pull Request',
		description: '개발 완료된 기능에 대한 Pull Request를 생성합니다',
		prompt: `명확한 제목과 설명으로 PR을 작성하고, 적절한 리뷰어와 라벨을 설정하여 Pull Request를 생성합니다.`
	}
};
