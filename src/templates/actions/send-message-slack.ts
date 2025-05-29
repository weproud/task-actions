import { YamlTemplate } from '../types';

export const SEND_MESSAGE_SLACK_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/send-message-slack.yaml',
	description: 'Slack 채널에 메시지 전송',
	content: {
		version: 1,
		kind: 'action',
		name: 'Send Message to Slack',
		description: 'Slack 채널에 메시지를 전송합니다',
		prompt: `Slack 채널에 메시지를 전송합니다.

다음 정보가 필요합니다:
- SLACK_WEBHOOK_URL 환경 변수에 설정된 Slack 웹훅 URL
- 전송할 메시지 내용
- 선택사항: 메시지 형식 (일반 텍스트, 마크다운, JSON 등)

다음 단계를 수행하세요:
1. 환경 변수에서 SLACK_WEBHOOK_URL 확인
2. 메시지 형식 및 내용 준비
3. HTTP POST 요청으로 Slack 웹훅에 메시지 전송
4. 전송 결과 확인 및 오류 처리

SLACK_WEBHOOK_URL 환경 변수가 설정되어 있지 않으면 사용자에게 설정을 요청하세요.

예시 메시지 형식:
{
  "text": "메시지 내용",
  "channel": "#general",
  "username": "Bot",
  "icon_emoji": ":robot_face:"
}

curl 예시:
curl -X POST -H 'Content-type: application/json' \\
--data '{"text":"Hello, World!"}' \\
\${SLACK_WEBHOOK_URL}`
	}
};
