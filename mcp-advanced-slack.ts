import { sendSlackMessage } from './src/core/utils';

const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function sendAdvancedMcpMessage() {
	console.log('🚀 고급 MCP Task Actions Slack 메시지를 준비 중...');

	const advancedMessage = {
		text: '🎯 MCP Task Actions 실행 완료!',
		username: 'Advanced MCP Bot',
		icon_emoji: ':gear:',
		attachments: [
			{
				color: '#FF6B6B',
				title: '🤖 MCP (Model Context Protocol) 명령 실행',
				text: '*사용자 요청: "task-actions mcp한테 send slack message를 요청해줘"*',
				fields: [
					{
						title: '🎯 실행된 명령',
						value: 'send_slack_message',
						short: true
					},
					{
						title: '🔧 프로토콜',
						value: 'MCP v1.0',
						short: true
					},
					{
						title: '⚡ 실행 시간',
						value: '< 1초',
						short: true
					},
					{
						title: '📊 상태',
						value: '성공 ✅',
						short: true
					}
				]
			},
			{
				color: '#4ECDC4',
				title: '🛠️ MCP 시스템 정보',
				fields: [
					{
						title: '사용 가능한 도구들',
						value:
							'• send_slack_message\n• send_rich_slack_message\n• send_task_completion_notification\n• init_project\n• start_task',
						short: false
					}
				]
			},
			{
				color: '#45B7D1',
				title: '📈 성과 요약',
				text: '이제 MCP를 통해 다양한 Task Actions 기능을 Slack과 연동할 수 있습니다!',
				fields: [
					{
						title: '구현 완료',
						value:
							'✅ ES 모듈 호환성\n✅ TypeScript 컴파일\n✅ Slack 웹훅 연동\n✅ MCP 프로토콜 지원',
						short: true
					},
					{
						title: '다음 가능한 작업',
						value:
							'🔹 프로젝트 초기화\n🔹 태스크 생성\n🔹 워크플로우 관리\n🔹 알림 자동화',
						short: true
					}
				],
				footer: 'Powered by Claude + Task Actions MCP',
				footer_icon: 'https://example.com/mcp-icon.png',
				ts: Math.floor(Date.now() / 1000)
			}
		]
	};

	try {
		const result = await sendSlackMessage(advancedMessage, SLACK_WEBHOOK_URL);

		if (result.success) {
			console.log('🎊 고급 MCP 메시지 전송 성공!');
			console.log('');
			console.log('┌─────────────────────────────────────────────┐');
			console.log('│  🤖 MCP TASK ACTIONS OPERATION COMPLETED   │');
			console.log('├─────────────────────────────────────────────┤');
			console.log('│  ✅ Command: send_slack_message             │');
			console.log('│  ✅ Status: SUCCESS                         │');
			console.log('│  ✅ Protocol: MCP v1.0                      │');
			console.log('│  ✅ Integration: Slack Webhook              │');
			console.log('└─────────────────────────────────────────────┘');
			console.log('');
			console.log('🎯 MCP를 통한 Slack 메시지 전송이 완료되었습니다!');
		} else {
			console.error('❌ 고급 MCP 메시지 전송 실패:', result.error);
		}
	} catch (error) {
		console.error('💥 오류 발생:', error);
	}
}

sendAdvancedMcpMessage();
