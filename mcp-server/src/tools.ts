import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export class TaskActionsTools {
	private readonly taskActionsCli: string;

	constructor() {
		// task-actions CLI 경로 설정 (상위 디렉토리의 빌드된 CLI)
		this.taskActionsCli = path.join(process.cwd(), '../dist/cli.js');
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
			return output || `${command} 명령어가 성공적으로 실행되었습니다.`;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			throw new Error(`❌ 명령어 실행 중 오류가 발생했습니다: ${errorMessage}`);
		}
	}

	async initProject(): Promise<string> {
		return this.executeCli('init');
	}

	async addAction(): Promise<string> {
		return this.executeCli('add', ['action']);
	}

	async addWorkflow(): Promise<string> {
		return this.executeCli('add', ['workflow']);
	}

	async addMcp(): Promise<string> {
		return this.executeCli('add', ['mcp']);
	}

	async addRule(): Promise<string> {
		return this.executeCli('add', ['rule']);
	}

	async addTask(
		taskId: string,
		taskName?: string,
		description?: string
	): Promise<string> {
		const args = ['task', taskId];

		if (taskName) {
			args.push(taskName);
		}

		if (description) {
			args.push('--description', description);
		}

		return this.executeCli('add', args);
	}

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

	async cleanProject(force?: boolean): Promise<string> {
		const args = force ? ['--force'] : [];
		return this.executeCli('clean', args);
	}

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
}
