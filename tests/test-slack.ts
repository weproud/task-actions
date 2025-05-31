import { sendSlackMessage } from '../src/core/utils';

// 제공된 Slack Webhook URL
const SLACK_WEBHOOK_URL =
	'https://hooks.slack.com/services/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';

async function testSlackMessage() {
	console.log('🔧 Slack 메시지 전송 테스트를 시작합니다...');

	try {
		// 1. 간단한 텍스트 메시지 테스트
		console.log('\n📝 간단한 텍스트 메시지 전송 중...');
		const simpleResult = await sendSlackMessage(
			'안녕하세요! Task Actions에서 보내는 테스트 메시지입니다. 🚀',
			SLACK_WEBHOOK_URL
		);

		if (simpleResult.success) {
			console.log('✅ 간단한 메시지 전송 성공!');
		} else {
			console.error('❌ 간단한 메시지 전송 실패:', simpleResult.error);
		}

		// 2. 풍부한 형식의 메시지 테스트
		console.log('\n🎨 풍부한 형식의 메시지 전송 중...');
		const richResult = await sendSlackMessage(
			{
				text: 'Task Actions CLI 알림',
				username: 'Task Actions Bot',
				icon_emoji: ':robot_face:',
				attachments: [
					{
						color: 'good',
						title: '✨ 테스트 알림',
						text: 'Slack 연동이 성공적으로 작동하고 있습니다!',
						fields: [
							{
								title: '상태',
								value: '정상 작동',
								short: true
							},
							{
								title: '시간',
								value: new Date().toLocaleString('ko-KR'),
								short: true
							},
							{
								title: '버전',
								value: '1.0.0',
								short: true
							}
						]
					}
				]
			},
			SLACK_WEBHOOK_URL
		);

		if (richResult.success) {
			console.log('✅ 풍부한 형식의 메시지 전송 성공!');
		} else {
			console.error('❌ 풍부한 형식의 메시지 전송 실패:', richResult.error);
		}

		// 3. 태스크 완료 알림 형식 테스트
		console.log('\n📋 태스크 완료 알림 형식 테스트 중...');
		const taskResult = await sendSlackMessage(
			{
				text: '🎉 태스크가 완료되었습니다!',
				username: 'Task Actions Bot',
				icon_emoji: ':white_check_mark:',
				attachments: [
					{
						color: '#36a64f',
						title: '태스크 완료 알림',
						fields: [
							{
								title: '태스크 ID',
								value: 'TASK-001',
								short: true
							},
							{
								title: '태스크 이름',
								value: 'Slack 연동 테스트',
								short: true
							},
							{
								title: '프로젝트',
								value: 'Task Actions CLI',
								short: true
							},
							{
								title: '완료 시간',
								value: new Date().toLocaleString('ko-KR'),
								short: true
							}
						]
					}
				]
			},
			SLACK_WEBHOOK_URL
		);

		if (taskResult.success) {
			console.log('✅ 태스크 완료 알림 전송 성공!');
		} else {
			console.error('❌ 태스크 완료 알림 전송 실패:', taskResult.error);
		}

		console.log('\n🎊 모든 테스트가 완료되었습니다!');
	} catch (error) {
		console.error('💥 테스트 중 오류 발생:', error);
	}
}

// 실행
testSlackMessage();
