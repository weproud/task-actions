import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export class TaskActionsTools {
	private readonly taskActionsCli: string;

	constructor() {
		// Set task-actions CLI path (using absolute path)
		this.taskActionsCli =
			'/Users/raiiz/labs/workspace/task-actions/dist/cli.js';
	}

	private async executeCli(
		command: string,
		args: string[] = []
	): Promise<string> {
		try {
			const fullCommand = `node ${this.taskActionsCli} ${command} ${args.join(
				' '
			)}`;
			const { stdout, stderr } = await execAsync(fullCommand, {
				cwd: process.cwd(),
				timeout: 30000 // 30초 타임아웃
			});

			const output = stdout + (stderr ? `\n\nWarnings/Errors:\n${stderr}` : '');
			return output || `${command} command executed successfully.`;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(
				`❌ Error occurred during command execution: ${errorMessage}`
			);
		}
	}

	async initProject(): Promise<string> {
		return this.executeCli('init');
	}

	// File generation methods removed - use CLI directly

	async listTemplates(type?: string): Promise<string> {
		const args = type ? ['--type', type] : [];
		return this.executeCli('list', args);
	}

	async checkStatus(detailed?: boolean): Promise<string> {
		const args = detailed ? ['--detailed'] : [];
		return this.executeCli('status', args);
	}

	async validateProject(): Promise<string> {
		return this.executeCli('validate');
	}

	// cleanProject method removed - use CLI directly for dangerous operations

	async startTask(
		taskId: string,
		output?: string,
		clipboard?: boolean
	): Promise<string> {
		const args = ['task', taskId];
		if (output) {
			args.push('--output', output);
		}
		if (clipboard) {
			args.push('--clipboard');
		}
		return this.executeCli('start', args);
	}

	async sendSlackMessage(message: string, channel?: string): Promise<string> {
		const args = ['--message', message];
		if (channel) {
			args.push('--channel', channel);
		}
		return this.executeCli('slack', args);
	}

	async sendTaskCompletionNotification(
		taskId: string,
		taskName: string,
		projectName?: string
	): Promise<string> {
		const args = ['--task-id', taskId, '--task-name', taskName];
		if (projectName) {
			args.push('--project-name', projectName);
		}
		return this.executeCli('notify', args);
	}

	async sendRichSlackMessage(
		text: string,
		title?: string,
		color?: string,
		fields?: Array<{ title: string; value: string; short?: boolean }>
	): Promise<string> {
		const args = ['--text', text];
		if (title) {
			args.push('--title', title);
		}
		if (color) {
			args.push('--color', color);
		}
		if (fields && fields.length > 0) {
			args.push('--fields', JSON.stringify(fields));
		}
		return this.executeCli('slack-rich', args);
	}
}
