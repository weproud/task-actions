import path from 'path';

// 상위 디렉토리의 core 모듈들을 import
import {
	checkProjectStatus,
	cleanProject,
	sendSlackMessage as coreSlackMessage,
	generateByType,
	generateTask,
	initProject,
	listTemplates,
	notifyTaskCompletion,
	startTask,
	validateProject
} from '../../src/core/index.js';

import type {
	ListTemplatesOptions,
	StatusOptions
} from '../../src/core/index.js';

import type { SlackMessage } from '../../src/core/utils.js';

export class TaskActionsTools {
	private readonly originalCwd: string;
	private readonly rootDir: string;

	constructor() {
		// 원래 작업 디렉터리를 저장
		this.originalCwd = process.cwd();
		// 프로젝트의 루트 디렉터리 설정
		this.rootDir = path.join(__dirname, '../..');
	}

	private async executeInProjectRoot<T>(fn: () => Promise<T>): Promise<T> {
		const originalCwd = process.cwd();
		try {
			// 작업 디렉터리를 프로젝트 루트로 변경
			process.chdir(this.rootDir);
			return await fn();
		} finally {
			// 원래 작업 디렉터리로 복원
			process.chdir(originalCwd);
		}
	}

	private async handleError(operation: string, error: any): Promise<string> {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(`❌ ${operation} 중 오류가 발생했습니다:`, errorMessage);
		throw new Error(`❌ ${operation} 중 오류가 발생했습니다: ${errorMessage}`);
	}

	async initProject(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await initProject();
			});
			return '✅ 프로젝트 초기화가 완료되었습니다!';
		} catch (error) {
			return this.handleError('프로젝트 초기화', error);
		}
	}

	async addAction(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await generateByType('action');
			});
			return '✅ Action 파일이 성공적으로 생성되었습니다!';
		} catch (error) {
			return this.handleError('Action 파일 생성', error);
		}
	}

	async addWorkflow(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await generateByType('workflow');
			});
			return '✅ Workflow 파일이 성공적으로 생성되었습니다!';
		} catch (error) {
			return this.handleError('Workflow 파일 생성', error);
		}
	}

	async addMcp(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await generateByType('mcp');
			});
			return '✅ MCP 파일이 성공적으로 생성되었습니다!';
		} catch (error) {
			return this.handleError('MCP 파일 생성', error);
		}
	}

	async addRule(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await generateByType('rule');
			});
			return '✅ Rule 파일이 성공적으로 생성되었습니다!';
		} catch (error) {
			return this.handleError('Rule 파일 생성', error);
		}
	}

	async addTask(taskId: string, taskName?: string): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await generateTask(taskId, taskName);
			});
			return `✅ 태스크 "${taskId}"가 성공적으로 생성되었습니다!`;
		} catch (error) {
			return this.handleError('태스크 생성', error);
		}
	}

	async listTemplates(type?: string): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				const options: ListTemplatesOptions = type ? { type } : {};
				await listTemplates(options);
			});
			return '✅ 템플릿 목록 조회가 완료되었습니다!';
		} catch (error) {
			return this.handleError('템플릿 목록 조회', error);
		}
	}

	async checkStatus(detailed?: boolean): Promise<string> {
		try {
			const status = await this.executeInProjectRoot(async () => {
				const options: StatusOptions = { detailed: detailed ?? false };
				return await checkProjectStatus(options);
			});

			let result = '📊 프로젝트 상태:\n';
			result += `- 상태: ${status.isInitialized ? '초기화됨' : '미초기화'}\n`;
			result += `- 필수 파일: ${status.hasRequiredFiles ? '존재' : '누락'}\n`;

			if (status.missingFiles && status.missingFiles.length > 0) {
				result += '\n❌ 누락된 파일들:\n';
				status.missingFiles.forEach((file) => {
					result += `  - ${file}\n`;
				});
			}

			return result;
		} catch (error) {
			return this.handleError('프로젝트 상태 확인', error);
		}
	}

	async validateProject(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await validateProject();
			});
			return '✅ 프로젝트 검증이 완료되었습니다!';
		} catch (error) {
			return this.handleError('프로젝트 검증', error);
		}
	}

	async cleanProject(): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await cleanProject();
			});
			return '✅ 프로젝트 정리가 완료되었습니다!';
		} catch (error) {
			return this.handleError('프로젝트 정리', error);
		}
	}

	async startTask(taskId: string): Promise<string> {
		try {
			await this.executeInProjectRoot(async () => {
				await startTask(taskId);
			});
			return `✅ 태스크 "${taskId}"가 성공적으로 시작되었습니다!`;
		} catch (error) {
			return this.handleError('태스크 시작', error);
		}
	}

	async sendSlackMessage(message: string, channel?: string): Promise<string> {
		try {
			const slackMessage: SlackMessage = {
				text: message,
				username: 'Task Actions Bot',
				icon_emoji: ':robot_face:',
				...(channel && { channel })
			};

			const result = await coreSlackMessage(slackMessage);

			if (result.success) {
				return '✅ Slack 메시지가 성공적으로 전송되었습니다!';
			} else {
				return `❌ Slack 메시지 전송 실패: ${result.error}`;
			}
		} catch (error) {
			return this.handleError('Slack 메시지 전송', error);
		}
	}

	async sendTaskCompletionNotification(
		taskId: string,
		taskName: string,
		projectName?: string
	): Promise<string> {
		try {
			const result = await notifyTaskCompletion(taskId, taskName, projectName);

			if (result.success) {
				return `✅ 태스크 "${taskId}" 완료 알림이 Slack으로 전송되었습니다!`;
			} else {
				return `❌ 태스크 완료 알림 전송 실패: ${result.error}`;
			}
		} catch (error) {
			return this.handleError('태스크 완료 알림 전송', error);
		}
	}

	async sendRichSlackMessage(
		text: string,
		title?: string,
		color?: string,
		fields?: Array<{ title: string; value: string; short?: boolean }>
	): Promise<string> {
		try {
			const slackMessage: SlackMessage = {
				text,
				username: 'Task Actions Bot',
				icon_emoji: ':white_check_mark:',
				attachments: [
					{
						color: color || 'good',
						title: title || '알림',
						...(fields && fields.length > 0 && { fields })
					}
				]
			};

			const result = await coreSlackMessage(slackMessage);

			if (result.success) {
				return '✅ 풍부한 형식의 Slack 메시지가 성공적으로 전송되었습니다!';
			} else {
				return `❌ Slack 메시지 전송 실패: ${result.error}`;
			}
		} catch (error) {
			return this.handleError('풍부한 형식의 Slack 메시지 전송', error);
		}
	}
}
