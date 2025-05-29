#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ErrorCode,
	ListToolsRequestSchema,
	McpError,
	CallToolResult
} from '@modelcontextprotocol/sdk/types.js';
import { TaskActionsTools } from './tools.js';

class TaskActionsMCPServer {
	private server: Server;
	private tools: TaskActionsTools;

	constructor() {
		this.server = new Server(
			{
				name: 'task-actions-mcp-server',
				version: '1.0.0'
			},
			{
				capabilities: {
					tools: {}
				}
			}
		);

		this.tools = new TaskActionsTools();
		this.setupToolHandlers();
	}

	private setupToolHandlers() {
		// Tools 리스트 요청 처리
		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			return {
				tools: [
					{
						name: 'init_project',
						description: '새로운 task-actions 프로젝트를 초기화합니다',
						inputSchema: {
							type: 'object',
							properties: {},
							required: []
						}
					},
					{
						name: 'add_action',
						description: 'action 파일들을 생성합니다',
						inputSchema: {
							type: 'object',
							properties: {},
							required: []
						}
					},
					{
						name: 'add_workflow',
						description: 'workflow 파일들을 생성합니다',
						inputSchema: {
							type: 'object',
							properties: {},
							required: []
						}
					},
					{
						name: 'add_mcp',
						description: 'mcp 파일들을 생성합니다',
						inputSchema: {
							type: 'object',
							properties: {},
							required: []
						}
					},
					{
						name: 'add_rule',
						description: 'rule 파일들을 생성합니다',
						inputSchema: {
							type: 'object',
							properties: {},
							required: []
						}
					},
					{
						name: 'add_task',
						description: '새로운 태스크 파일을 생성합니다',
						inputSchema: {
							type: 'object',
							properties: {
								taskId: {
									type: 'string',
									description: '태스크 ID'
								},
								taskName: {
									type: 'string',
									description: '태스크 이름'
								},
								description: {
									type: 'string',
									description: '태스크 설명'
								}
							},
							required: ['taskId']
						}
					},
					{
						name: 'list_templates',
						description: '사용 가능한 템플릿 목록을 조회합니다',
						inputSchema: {
							type: 'object',
							properties: {
								type: {
									type: 'string',
									description: '특정 타입만 조회',
									enum: ['action', 'workflow', 'mcp', 'rule', 'task']
								}
							},
							required: []
						}
					},
					{
						name: 'check_status',
						description: '프로젝트 상태를 확인합니다',
						inputSchema: {
							type: 'object',
							properties: {
								detailed: {
									type: 'boolean',
									description: '상세한 정보 표시',
									default: false
								}
							},
							required: []
						}
					},
					{
						name: 'validate_project',
						description: '생성된 파일들의 유효성을 검사합니다',
						inputSchema: {
							type: 'object',
							properties: {},
							required: []
						}
					},
					{
						name: 'clean_project',
						description: '생성된 파일들을 정리합니다',
						inputSchema: {
							type: 'object',
							properties: {
								force: {
									type: 'boolean',
									description: '확인 없이 강제 삭제',
									default: false
								}
							},
							required: []
						}
					},
					{
						name: 'start_task',
						description: '지정된 task ID의 태스크를 시작합니다',
						inputSchema: {
							type: 'object',
							properties: {
								taskId: {
									type: 'string',
									description: '시작할 태스크 ID'
								},
								output: {
									type: 'string',
									description: 'Prompt를 파일로 저장할 경로'
								},
								clipboard: {
									type: 'boolean',
									description: 'Prompt를 클립보드에 복사 (macOS만 지원)',
									default: false
								}
							},
							required: ['taskId']
						}
					}
				]
			};
		});

		// Tool 실행 요청 처리
		this.server.setRequestHandler(
			CallToolRequestSchema,
			async (request): Promise<CallToolResult> => {
				const { name, arguments: args } = request.params;

				try {
					let result;
					switch (name) {
						case 'init_project':
							result = await this.tools.initProject();
							break;

						case 'add_action':
							result = await this.tools.addAction();
							break;

						case 'add_workflow':
							result = await this.tools.addWorkflow();
							break;

						case 'add_mcp':
							result = await this.tools.addMcp();
							break;

						case 'add_rule':
							result = await this.tools.addRule();
							break;

						case 'add_task':
							result = await this.tools.addTask(
								args?.taskId as string,
								args?.taskName as string,
								args?.description as string
							);
							break;

						case 'list_templates':
							result = await this.tools.listTemplates(args?.type as string);
							break;

						case 'check_status':
							result = await this.tools.checkStatus(args?.detailed as boolean);
							break;

						case 'validate_project':
							result = await this.tools.validateProject();
							break;

						case 'clean_project':
							result = await this.tools.cleanProject(args?.force as boolean);
							break;

						case 'start_task':
							result = await this.tools.startTask(
								args?.taskId as string,
								args?.output as string,
								args?.clipboard as boolean
							);
							break;

						default:
							throw new McpError(
								ErrorCode.MethodNotFound,
								`Unknown tool: ${name}`
							);
					}

					return result;
				} catch (error) {
					if (error instanceof McpError) {
						throw error;
					}
					throw new McpError(
						ErrorCode.InternalError,
						`Tool execution failed: ${
							error instanceof Error ? error.message : String(error)
						}`
					);
				}
			}
		);
	}

	async run() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);
		console.error('Task Actions MCP 서버가 시작되었습니다');
	}
}

// 서버 시작
if (require.main === module) {
	const server = new TaskActionsMCPServer();
	server.run().catch(console.error);
}
