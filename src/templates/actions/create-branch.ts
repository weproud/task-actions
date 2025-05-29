import { YamlTemplate } from '../types';

export const CREATE_BRANCH_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/create-branch.yaml',
	description: '새로운 Git 브랜치를 생성한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Create Branch',
		description: '새로운 Git 브랜치를 생성한다',
		prompt: `{{branchPrefix}}/ prefix를 사용하여 적절한 브랜치명을 생성하고, 최신 main/develop 브랜치에서 새 브랜치를 생성하여 체크아웃합니다.`
	}
};
