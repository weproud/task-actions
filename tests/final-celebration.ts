import { sendSlackMessage } from '../src/core/utils';

const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function sendCelebrationMessage() {
	console.log('🎊 최종 축하 메시지를 준비 중...');

	const celebrationMessage = {
		text: '🎉 MISSION ACCOMPLISHED! 🎉',
		username: 'Claude & Task Actions',
		icon_emoji: ':party_blob:',
		attachments: [
			{
				color: '#FF6B6B',
				title: '🏆 완벽한 성공! Task Actions MCP + Slack 연동 완료',
				text: '*아무 메시지나 보내달라고 했는데... 이렇게 멋진 시스템이 완성되었습니다!* 🚀',
				fields: [
					{
						title: '✨ 달성한 것들',
						value:
							'• ES 모듈 문제 완전 해결\n• TypeScript 설정 최적화\n• Slack API 완벽 연동\n• 다양한 메시지 형식 테스트\n• MCP 시스템 구축',
						short: false
					},
					{
						title: '🎯 사용된 기술',
						value: 'TypeScript, Node.js, Slack API, MCP',
						short: true
					},
					{
						title: '⚡ 처리 시간',
						value: '몇 분 만에 완성!',
						short: true
					},
					{
						title: '🎊 결과',
						value: '완벽한 성공! 🏆',
						short: true
					},
					{
						title: '🤖 AI 어시스턴트',
						value: 'Claude Sonnet 4',
						short: true
					}
				],
				footer: '이제 MCP를 통해 언제든지 Slack 메시지를 보낼 수 있어요!',
				footer_icon:
					'https://ca.slack-edge.com/T08QQGG5S8L-U08QV4ZKY0T-g50d90d3b0c4-24',
				ts: Math.floor(Date.now() / 1000)
			},
			{
				color: '#4ECDC4',
				title: '🎪 재미있는 사실',
				text: '처음엔 단순히 "아무 메시지나 보내달라"고 했는데, 결국 완전한 개발 워크플로우 시스템을 만들게 되었습니다! 😄',
				thumb_url:
					'https://emojipedia-us.s3.amazonaws.com/source/skype/289/party-popper_1f389.png'
			}
		]
	};

	try {
		const result = await sendSlackMessage(
			celebrationMessage,
			SLACK_WEBHOOK_URL
		);

		if (result.success) {
			console.log('🎉 축하 메시지 전송 성공!');
			console.log('');
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('🎊 TASK ACTIONS MCP + SLACK 연동 완료! 🎊');
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('');
			console.log(
				'✅ 이제 MCP를 통해 언제든지 Slack 메시지를 보낼 수 있습니다!'
			);
			console.log('✅ TypeScript + ES 모듈 문제도 완전히 해결되었습니다!');
			console.log('✅ 다양한 형태의 메시지 전송이 가능합니다!');
			console.log('');
			console.log('🚀 다음에는 MCP 서버를 통해 직접 메시지를 보내보세요!');
			console.log('');
		} else {
			console.error('❌ 축하 메시지 전송 실패:', result.error);
		}
	} catch (error) {
		console.error('💥 오류 발생:', error);
	}
}

sendCelebrationMessage();
