import { YamlTemplate } from '../types';

export const SEND_MESSAGE_DISCORD_ACTION_TEMPLATE: YamlTemplate = {
	name: 'actions/send-message-discord.yaml',
	description: 'Discord 채널에 메시지 전송',
	content: {
		version: 1,
		kind: 'action',
		name: 'Send Message to Discord',
		description: 'Discord 채널에 메시지를 전송합니다',
		prompt: `Discord 채널에 메시지를 전송합니다.

다음 정보가 필요합니다:
- DISCORD_WEBHOOK_URL 환경 변수에 설정된 Discord 웹훅 URL
- 전송할 메시지 내용
- 선택사항: 메시지 형식 (일반 텍스트, 임베드 등)

다음 단계를 수행하세요:
1. 환경 변수에서 DISCORD_WEBHOOK_URL 확인
2. 메시지 형식 및 내용 준비
3. HTTP POST 요청으로 Discord 웹훅에 메시지 전송
4. 전송 결과 확인 및 오류 처리

DISCORD_WEBHOOK_URL 환경 변수가 설정되어 있지 않으면 사용자에게 설정을 요청하세요.

예시 메시지 형식:
{
  "content": "메시지 내용",
  "username": "Bot",
  "embeds": [
    {
      "title": "제목",
      "description": "설명",
      "color": 16711680,
      "fields": [
        {
          "name": "필드 이름",
          "value": "필드 값",
          "inline": true
        }
      ]
    }
  ]
}

curl 예시:
curl -X POST -H 'Content-type: application/json' \\
--data '{"content":"Hello, World!"}' \\
\${DISCORD_WEBHOOK_URL}`
	}
};
