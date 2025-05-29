import { YamlTemplate } from '../types';

export const TASK_DONE_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/task-done.yaml',
	description: '태스크 완료 처리 및 정리 작업을 수행한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Task Done',
		description: '태스크 완료 처리 및 정리 작업을 수행한다',
		prompt: `태스크 완료 후 정리 작업을 수행합니다.

				다음 단계를 수행해주세요:
				1. **완료 확인**
				- 모든 요구사항이 구현되었는지 확인
				- 테스트가 통과하는지 확인
				- 문서가 업데이트되었는지 확인

				2. **코드 정리**
				- 불필요한 주석이나 디버그 코드 제거
				- 코드 스타일 검사 및 정리
				- 최종 테스트 실행

				3. **상태 업데이트**
				- 태스크 상태를 'done'으로 변경
				- 관련 이슈나 티켓 상태 업데이트
				- 완료 시간 기록

				4. **알림 및 보고**
				- 팀에 완료 알림 전송
				- 완료 보고서 작성 (필요시)
				- 다음 태스크 준비

				프로젝트: {{projectName}}
				완료자: {{author}}
				알림 채널: {{slackHookUrl}}`
	}
};
