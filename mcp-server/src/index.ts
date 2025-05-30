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
- 프로젝트 초기화 및 관리
- Action, Workflow, MCP, Rule, Task 템플릿 생성
- 태스크 기반 개발 프로세스 지원
- 프로젝트 상태 확인 및 검증

이 서버는 개발자가 체계적으로 프로젝트를 관리하고 생산성을 높일 수 있도록 도와줍니다.
	`.trim()
});

// Tools 인스턴스 생성
const tools = new TaskActionsTools();

// 프로젝트 초기화 도구
server.addTool({
	name: 'init',
	description: '새로운 task-actions 프로젝트를 초기화합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.initProject();
	}
});

// 태스크 시작 도구
server.addTool({
	name: 'start_task',
	description: '지정된 task ID의 태스크를 시작합니다',
	parameters: z.object({
		taskId: z.string().describe('시작할 태스크 ID')
	}),
	execute: async (args) => {
		return await tools.startTask(args.taskId);
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

server.start({
	transportType: 'stdio'
});
