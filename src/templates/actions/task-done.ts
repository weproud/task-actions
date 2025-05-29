import { YamlTemplate } from '../types';

export const TASK_DONE_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/task-done.yaml',
	description: '태스크 완료 처리 및 정리 작업을 수행한다',
	content: {
		version: 1,
		kind: 'action',
		name: 'Task Done',
		description: '태스크 완료 처리 및 정리 작업을 수행한다',
		prompt: `태스크 완료 처리를 수행합니다.

다음 단계를 수행하세요:
1. 요구사항 구현 확인 및 검증
2. 코드 정리 및 리팩토링
3. 테스트 실행 및 확인
4. 태스크 상태를 'done'으로 변경
5. 팀에 완료 알림 전송

알림 전송:
- SLACK_WEBHOOK_URL 환경변수가 설정되어 있으면 Slack으로 태스크 완료 알림을 전송하세요
- DISCORD_WEBHOOK_URL 환경변수가 설정되어 있으면 Discord로 태스크 완료 알림을 전송하세요
- 알림에는 태스크 ID, 태스크 이름, 프로젝트 정보를 포함하세요
- 전송 실패 시에도 오류를 표시하고 계속 진행하세요

Slack 알림 메시지 예시:
{
  "text": "✅ 태스크 완료!",
  "username": "Task Actions Bot",
  "icon_emoji": ":white_check_mark:",
  "attachments": [
    {
      "color": "good",
      "title": "태스크 정보",
      "fields": [
        {
          "title": "태스크 ID",
          "value": "TASK-001",
          "short": true
        },
        {
          "title": "태스크 이름",
          "value": "사용자 인증 기능 구현",
          "short": true
        }
      ]
    }
  ]
}

Discord 알림 메시지 예시:
{
  "content": "✅ 태스크 완료!",
  "username": "Task Actions Bot",
  "embeds": [
    {
      "color": 65280,
      "title": "태스크 정보",
      "fields": [
        {
          "name": "태스크 ID",
          "value": "TASK-001",
          "inline": true
        },
        {
          "name": "태스크 이름",
          "value": "사용자 인증 기능 구현",
          "inline": true
        }
      ]
    }
  ]
}`
	}
};
