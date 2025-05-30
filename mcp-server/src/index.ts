#!/usr/bin/env node

import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { TaskActionsTools } from './tools.js';

// Create FastMCP server
const server = new FastMCP({
	name: 'Task Actions MCP Server',
	version: '2.0.0',
	instructions: `
MCP server that manages GitHub Actions-style development workflows in integration with Task Actions CLI.

Key features:
- Check and validate project status
- Start and execute tasks (YAML structure output)
- Query template lists
- Send Slack notifications

This server specializes in information retrieval and task execution. For actual file creation, use the CLI directly.
	`.trim()
});

// Create Tools instance
const tools = new TaskActionsTools();

// Project status check tool
server.addTool({
	name: 'check_status',
	description: 'Check project status',
	parameters: z.object({
		detailed: z
			.boolean()
			.optional()
			.default(false)
			.describe('Display detailed information')
	}),
	execute: async (args) => {
		return await tools.checkStatus(args.detailed);
	}
});

// Project validation tool
server.addTool({
	name: 'validate',
	description: 'Validate generated files',
	parameters: z.object({}),
	execute: async () => {
		return await tools.validateProject();
	}
});

// Task start tool
server.addTool({
	name: 'start_task',
	description: 'Start task with specified task ID',
	parameters: z.object({
		taskId: z.string().describe('Task ID to start'),
		output: z.string().optional().describe('Path to save prompt as file'),
		clipboard: z
			.boolean()
			.optional()
			.default(false)
			.describe('Copy prompt to clipboard (macOS only)')
	}),
	execute: async (args) => {
		return await tools.startTask(args.taskId, args.output, args.clipboard);
	}
});

// Slack message sending tool
server.addTool({
	name: 'send_slack_message',
	description: 'Send message to Slack',
	parameters: z.object({
		message: z.string().describe('Message to send'),
		channel: z.string().optional().describe('Channel to send to (optional)')
	}),
	execute: async (args) => {
		return await tools.sendSlackMessage(args.message, args.channel);
	}
});

// Rich format Slack message sending tool
server.addTool({
	name: 'send_rich_slack_message',
	description: 'Send rich format Slack message (with attachments)',
	parameters: z.object({
		text: z.string().describe('Message text'),
		title: z.string().optional().describe('Attachment title'),
		color: z
			.string()
			.optional()
			.describe('Attachment color (good, warning, danger or hex)'),
		fields: z
			.array(
				z.object({
					title: z.string().describe('Field title'),
					value: z.string().describe('Field value'),
					short: z
						.boolean()
						.optional()
						.describe('Whether to display in short format')
				})
			)
			.optional()
			.describe('Additional fields')
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

// Task completion notification tool
server.addTool({
	name: 'send_task_completion_notification',
	description: 'Send task completion notification to Slack',
	parameters: z.object({
		taskId: z.string().describe('Completed task ID'),
		taskName: z.string().describe('Completed task name'),
		projectName: z.string().optional().describe('Project name (optional)')
	}),
	execute: async (args) => {
		return await tools.sendTaskCompletionNotification(
			args.taskId,
			args.taskName,
			args.projectName
		);
	}
});

// Server event listeners
server.on('connect', (event) => {
	console.log('🔗 Client connected:', event.session);
});

server.on('disconnect', (event) => {
	console.log('📪 Client disconnected:', event.session);
});

// Start server
console.log('🚀 Starting Task Actions FastMCP server...');
server.start({
	transportType: 'stdio'
});
console.log('✅ Server started successfully!');
