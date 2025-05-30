import { sendSlackMessage } from './src/core/utils';

const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function testMcpSlackMessage() {
	console.log('🔧 MCP를 통한 Slack 메시지 전송 테스트...');

	// 간단한 메시지
	const message = '🚀 안녕하세요! MCP task-actions를 통해 전송된 메시지입니다!';

	try {
		const result = await sendSlackMessage(message, SLACK_WEBHOOK_URL);

		if (result.success) {
			console.log('✅ MCP Slack 메시지 전송 성공!');
			console.log('📱 메시지:', message);
		} else {
			console.error('❌ MCP Slack 메시지 전송 실패:', result.error);
		}
	} catch (error) {
		console.error('💥 오류 발생:', error);
	}
}

testMcpSlackMessage();
