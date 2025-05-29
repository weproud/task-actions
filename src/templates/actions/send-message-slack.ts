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
- Slack 워크스페이스 URL 또는 웹훅 URL
- 전송할 채널명 또는 채널 ID
- 메시지 내용
- 선택사항: 메시지 형식 (일반 텍스트, 마크다운, 블록 등)

다음 단계를 수행하세요:
1. Slack API 토큰 또는 웹훅 URL 확인
2. 대상 채널 확인
3. 메시지 형식 및 내용 준비
4. Slack API를 통해 메시지 전송
5. 전송 결과 확인 및 오류 처리

환경 변수에서 SLACK_TOKEN, SLACK_WEBHOOK_URL 등을 확인하고, 없으면 사용자에게 설정을 요청하세요.`
	}
};
