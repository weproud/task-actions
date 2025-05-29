import { YamlTemplate } from '../types';

export const TASK_DONE_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/task-done.yaml',
	description: '태스크 완료 처리 및 정리 작업을 수행한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Task Done',
		description: '태스크 완료 처리 및 정리 작업을 수행한다',
		prompt: `요구사항 구현 확인, 코드 정리, 태스크 상태를 'done'으로 변경하고 팀에 완료 알림을 전송합니다.`
	}
};
