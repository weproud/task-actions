#!/usr/bin/env node

import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { TaskActionsTools } from './tools.js';

// FastMCP 서버 생성
const server = new FastMCP({
	name: 'Task Actions MCP Server',
	version: '2.0.0',
	instructions: `
Task Actions CLI와 연동하여 GitHub Actions 스타일의 개발 워크플로우를 관리하는 MCP 서버입니다.

주요 기능:
- 프로젝트 상태 확인 및 검증
- 태스크 시작 및 실행 (YAML 구조 출력)
- 템플릿 목록 조회
- Slack 알림 전송

이 서버는 정보 조회와 태스크 실행에 특화되어 있으며, 실제 파일 생성은 CLI를 직접 사용해야 합니다.
	`.trim()
});

// Tools 인스턴스 생성
const tools = new TaskActionsTools();

// 프로젝트 상태 확인 도구
server.addTool({
	name: 'check_status',
	description: '프로젝트 상태를 확인합니다',
	parameters: z.object({
		detailed: z.boolean().optional().default(false).describe('상세한 정보 표시')
	}),
	execute: async (args) => {
		return await tools.checkStatus(args.detailed);
	}
});

// 프로젝트 검증 도구
server.addTool({
	name: 'validate',
	description: '생성된 파일들의 유효성을 검사합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.validateProject();
	}
});

// 태스크 시작 도구
server.addTool({
	name: 'start_task',
	description: '지정된 task ID의 태스크를 시작합니다',
	parameters: z.object({
		taskId: z.string().describe('시작할 태스크 ID'),
		output: z.string().optional().describe('Prompt를 파일로 저장할 경로'),
		clipboard: z
			.boolean()
			.optional()
			.default(false)
			.describe('Prompt를 클립보드에 복사 (macOS만 지원)')
	}),
	execute: async (args) => {
		return await tools.startTask(args.taskId, args.output, args.clipboard);
	}
});

// Slack 메시지 전송 도구
server.addTool({
	name: 'send_slack_message',
	description: 'Slack으로 메시지를 전송합니다',
	parameters: z.object({
		message: z.string().describe('전송할 메시지'),
		channel: z.string().optional().describe('전송할 채널 (선택사항)')
	}),
	execute: async (args) => {
		return await tools.sendSlackMessage(args.message, args.channel);
	}
});

// 풍부한 형식의 Slack 메시지 전송 도구
server.addTool({
	name: 'send_rich_slack_message',
	description: '풍부한 형식(첨부파일 포함)의 Slack 메시지를 전송합니다',
	parameters: z.object({
		text: z.string().describe('메시지 텍스트'),
		title: z.string().optional().describe('첨부파일 제목'),
		color: z
			.string()
			.optional()
			.describe('첨부파일 색상 (good, warning, danger 또는 hex)'),
		fields: z
			.array(
				z.object({
					title: z.string().describe('필드 제목'),
					value: z.string().describe('필드 값'),
					short: z.boolean().optional().describe('짧은 형식 표시 여부')
				})
			)
			.optional()
			.describe('추가 필드들')
	}),
	execute: async (args) => {
		return await tools.sendRichSlackMessage(
			args.text,
			args.title,
			args.color,
			args.fields as
				| Array<{ title: string; value: string; short?: boolean }>
				| undefined
		);
	}
});

// 태스크 완료 알림 도구
server.addTool({
	name: 'send_task_completion_notification',
	description: '태스크 완료 알림을 Slack으로 전송합니다',
	parameters: z.object({
		taskId: z.string().describe('완료된 태스크 ID'),
		taskName: z.string().describe('완료된 태스크 이름'),
		projectName: z.string().optional().describe('프로젝트 이름 (선택사항)')
	}),
	execute: async (args) => {
		return await tools.sendTaskCompletionNotification(
			args.taskId,
			args.taskName,
			args.projectName
		);
	}
});

// 서버 이벤트 리스너
server.on('connect', (event) => {
	console.log('🔗 클라이언트가 연결되었습니다:', event.session);
});

server.on('disconnect', (event) => {
	console.log('📪 클라이언트가 연결 해제되었습니다:', event.session);
});

// 서버 시작
console.log('🚀 Task Actions FastMCP 서버를 시작합니다...');
server.start({
	transportType: 'stdio'
});
console.log('✅ 서버가 성공적으로 시작되었습니다!');
