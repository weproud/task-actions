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
	name: 'init_project',
	description: '새로운 task-actions 프로젝트를 초기화합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.initProject();
	}
});

// Action 템플릿 생성 도구
server.addTool({
	name: 'add_action',
	description: 'action 파일들을 생성합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.addAction();
	}
});

// Workflow 템플릿 생성 도구
server.addTool({
	name: 'add_workflow',
	description: 'workflow 파일들을 생성합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.addWorkflow();
	}
});

// MCP 템플릿 생성 도구
server.addTool({
	name: 'add_mcp',
	description: 'mcp 파일들을 생성합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.addMcp();
	}
});

// Rule 템플릿 생성 도구
server.addTool({
	name: 'add_rule',
	description: 'rule 파일들을 생성합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.addRule();
	}
});

// Task 생성 도구
server.addTool({
	name: 'add_task',
	description: '새로운 태스크 파일을 생성합니다',
	parameters: z.object({
		taskId: z.string().describe('태스크 ID'),
		taskName: z.string().optional().describe('태스크 이름'),
		description: z.string().optional().describe('태스크 설명')
	}),
	execute: async (args) => {
		return await tools.addTask(args.taskId, args.taskName, args.description);
	}
});

// 템플릿 목록 조회 도구
server.addTool({
	name: 'list_templates',
	description: '사용 가능한 템플릿 목록을 조회합니다',
	parameters: z.object({
		type: z
			.enum(['action', 'workflow', 'mcp', 'rule', 'task'])
			.optional()
			.describe('특정 타입만 조회')
	}),
	execute: async (args) => {
		return await tools.listTemplates(args.type);
	}
});

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
	name: 'validate_project',
	description: '생성된 파일들의 유효성을 검사합니다',
	parameters: z.object({}),
	execute: async () => {
		return await tools.validateProject();
	}
});

// 프로젝트 정리 도구
server.addTool({
	name: 'clean_project',
	description: '생성된 파일들을 정리합니다',
	parameters: z.object({
		force: z.boolean().optional().default(false).describe('확인 없이 강제 삭제')
	}),
	execute: async (args) => {
		return await tools.cleanProject(args.force);
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
