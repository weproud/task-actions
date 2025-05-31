import { sendSlackMessage } from '../src/core/utils';

const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function sendPartyMessage() {
	console.log('🎉 파티 메시지를 준비 중...');

	const messages = [
		{
			text: '🎊 MCP Task Actions가 성공적으로 동작하고 있어요!',
			username: 'Party Bot',
			icon_emoji: ':tada:',
			attachments: [
				{
					color: 'good',
					title: '🎯 성공 보고서',
					text: 'ES 모듈 문제를 해결하고 Slack 연동까지 완료했습니다!',
					fields: [
						{
							title: '해결된 문제',
							value:
								'• ES 모듈 vs CommonJS 충돌\n• TypeScript 컴파일 설정\n• MCP 서버 연동',
							short: false
						}
					]
				}
			]
		},
		{
			text: '💻 개발자를 위한 알림',
			username: 'Dev Assistant',
			icon_emoji: ':computer:',
			attachments: [
				{
					color: '#36a64f',
					title: '🛠️ 기술적 성과',
					fields: [
						{
							title: '언어',
							value: 'TypeScript',
							short: true
						},
						{
							title: '모듈 시스템',
							value: 'ES Modules',
							short: true
						},
						{
							title: '빌드 도구',
							value: 'tsc',
							short: true
						},
						{
							title: '실행 도구',
							value: 'tsx',
							short: true
						}
					]
				}
			]
		},
		{
			text: '🚀 다음 미션 준비 완료!',
			username: 'Mission Control',
			icon_emoji: ':rocket:',
			attachments: [
				{
					color: '#ff9f00',
					title: '🎯 준비된 기능들',
					text: '• 프로젝트 초기화\n• 템플릿 생성\n• 태스크 관리\n• Slack 알림\n• MCP 서버 연동',
					footer: 'Task Actions CLI v1.0.0'
				}
			]
		}
	];

	for (let i = 0; i < messages.length; i++) {
		console.log(`📤 메시지 ${i + 1}/${messages.length} 전송 중...`);

		try {
			const result = await sendSlackMessage(messages[i], SLACK_WEBHOOK_URL);

			if (result.success) {
				console.log(`✅ 메시지 ${i + 1} 전송 성공!`);
			} else {
				console.error(`❌ 메시지 ${i + 1} 전송 실패:`, result.error);
			}

			// 메시지 사이에 잠깐 대기
			if (i < messages.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		} catch (error) {
			console.error(`💥 메시지 ${i + 1} 전송 중 오류:`, error);
		}
	}

	console.log('🎊 모든 파티 메시지 전송 완료!');
}

sendPartyMessage();
