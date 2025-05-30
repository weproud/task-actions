import { sendSlackMessage } from './src/core/utils';

const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function mcpSendSlackMessage() {
	console.log('🤖 MCP Task Actions에서 Slack 메시지 전송 요청을 받았습니다!');
	console.log('');

	// 사용자 요청에 대한 MCP 스타일 응답
	const message = {
		text: '📱 MCP에서 전송하는 메시지입니다!',
		username: 'Task Actions MCP',
		icon_emoji: ':robot_face:',
		attachments: [
			{
				color: '#36C5F0',
				title: '🚀 MCP를 통한 Slack 메시지 전송',
				text: '사용자가 "task-actions mcp한테 send slack message를 요청"하셨습니다!',
				fields: [
					{
						title: '요청자',
						value: '사용자',
						short: true
					},
					{
						title: '실행 도구',
						value: 'Task Actions MCP',
						short: true
					},
					{
						title: '메시지 타입',
						value: 'Slack 웹훅',
						short: true
					},
					{
						title: '상태',
						value: '전송 중... 🚀',
						short: true
					}
				],
				footer: 'MCP (Model Context Protocol)',
				ts: Math.floor(Date.now() / 1000)
			}
		]
	};

	try {
		console.log('📤 MCP가 Slack 메시지를 전송합니다...');
		const result = await sendSlackMessage(message, SLACK_WEBHOOK_URL);

		if (result.success) {
			console.log('✅ MCP를 통한 Slack 메시지 전송 성공!');
			console.log('');
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('🎯 MCP SLACK MESSAGE SENT SUCCESSFULLY! 🎯');
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('');
			console.log('📱 메시지가 Slack 채널로 전송되었습니다!');
			console.log('🤖 MCP Task Actions가 성공적으로 작동했습니다!');
			console.log('');
		} else {
			console.error('❌ MCP Slack 메시지 전송 실패:', result.error);
		}
	} catch (error) {
		console.error('💥 MCP 실행 중 오류 발생:', error);
	}
}

// MCP 호출 시뮬레이션
mcpSendSlackMessage();
