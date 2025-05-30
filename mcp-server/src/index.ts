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
		taskId: z.string().describe('시작할 태스크 ID'),
		output: z.string().optional().describe('YAML 구조를 파일로 저장할 경로'),
		clipboard: z
			.boolean()
			.optional()
			.default(false)
			.describe('YAML 구조를 클립보드에 복사 (macOS만 지원)')
	}),
	execute: async (args) => {
		return await tools.startTask(args.taskId, args.output, args.clipboard);
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
