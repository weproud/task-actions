import { sendSlackMessage } from '../src/core/utils';

const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function sendFunMessage() {
	console.log('🎪 재미있는 메시지를 Slack으로 보냅니다...');

	const funMessage = {
		text: '🎯 MCP Task Actions 시스템이 작동 중입니다!',
		username: 'Task Actions AI',
		icon_emoji: ':robot_face:',
		attachments: [
			{
				color: '#ff6b6b',
				title: '🚀 AI 개발 어시스턴트가 일하고 있어요!',
				text: '현재 TypeScript, ES 모듈, Slack 연동까지 완벽하게 동작하고 있습니다! 🎉',
				fields: [
					{
						title: '⚡ 현재 상태',
						value: '모든 시스템 정상 작동',
						short: true
					},
					{
						title: '🎯 작업 완료',
						value: 'ES 모듈 문제 해결 완료',
						short: true
					},
					{
						title: '🔥 테스트 결과',
						value: 'Slack 메시지 전송 성공',
						short: true
					},
					{
						title: '🌟 다음 단계',
						value: 'MCP 서버 완전 연동',
						short: true
					}
				],
				footer: 'Task Actions MCP',
				footer_icon:
					'https://emoji.slack-edge.com/T08QQGG5S8L/party_blob/af690fe5bee8deb5.gif',
				ts: Math.floor(Date.now() / 1000)
			}
		]
	};

	try {
		const result = await sendSlackMessage(funMessage, SLACK_WEBHOOK_URL);

		if (result.success) {
			console.log('✅ 재미있는 메시지 전송 성공! 🎊');
			console.log('📱 Slack에서 확인해보세요!');
		} else {
			console.error('❌ 메시지 전송 실패:', result.error);
		}
	} catch (error) {
		console.error('💥 오류 발생:', error);
	}
}

sendFunMessage();
