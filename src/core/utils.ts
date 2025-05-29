import * as fs from 'fs';
import * as path from 'path';
import { FileSystemUtils } from '../generator';

/**
 * 기본 프로젝트 이름 가져오기
 */
export function getDefaultProjectName(): string {
	const currentDir = process.cwd();
	const packageJsonPath = path.join(currentDir, 'package.json');

	if (FileSystemUtils.fileExists(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(FileSystemUtils.readFile(packageJsonPath));
			return packageJson.name || path.basename(currentDir);
		} catch (error) {
			console.warn('package.json 파일 읽기 실패, 기본값 사용');
		}
	}

	return path.basename(currentDir);
}

/**
 * 기본 작성자 가져오기
 */
export function getDefaultAuthor(): string {
	const currentDir = process.cwd();
	const packageJsonPath = path.join(currentDir, 'package.json');

	if (FileSystemUtils.fileExists(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(FileSystemUtils.readFile(packageJsonPath));
			return packageJson.author || 'Developer';
		} catch (error) {
			console.warn('package.json 파일 읽기 실패, 기본값 사용');
		}
	}

	return 'Developer';
}

/**
 * 디렉토리 구조 출력
 */
export function printDirectoryTree(dirPath: string, prefix: string = ''): void {
	if (!FileSystemUtils.fileExists(dirPath)) {
		return;
	}

	try {
		const items = fs.readdirSync(dirPath);
		items.forEach((item, index) => {
			const itemPath = path.join(dirPath, item);
			const isLast = index === items.length - 1;
			const currentPrefix = isLast ? '└── ' : '├── ';
			const nextPrefix = isLast ? '    ' : '│   ';

			console.log(`${prefix}${currentPrefix}${item}`);

			const stats = fs.statSync(itemPath);
			if (stats.isDirectory()) {
				printDirectoryTree(itemPath, prefix + nextPrefix);
			}
		});
	} catch (error) {
		console.log(`${prefix}❌ 읽기 오류`);
	}
}

/**
 * 다음 단계 안내
 */
export function printNextSteps(): void {
	console.log('\n📝 다음 단계:');
	console.log(`1. .task-actions/vars.yaml 파일에서 환경 변수를 설정하세요`);
	console.log(
		`2. .task-actions/tasks.yaml 파일을 편집하여 태스크를 정의하세요`
	);
	console.log(
		'3. task-actions add task <task-id> 명령어로 새 태스크를 생성하세요'
	);
	console.log('4. task-actions status 명령어로 프로젝트 상태를 확인하세요');
}

/**
 * 배열을 키로 그룹화
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
	return array.reduce((groups, item) => {
		const group = String(item[key]);
		groups[group] = groups[group] || [];
		groups[group].push(item);
		return groups;
	}, {} as Record<string, T[]>);
}

/**
 * Slack 메시지 전송 인터페이스
 */
export interface SlackMessage {
	text: string;
	channel?: string;
	username?: string;
	icon_emoji?: string;
	icon_url?: string;
	attachments?: Array<{
		color?: string;
		title?: string;
		text?: string;
		fields?: Array<{
			title: string;
			value: string;
			short?: boolean;
		}>;
	}>;
}

/**
 * Slack Hook URL을 이용해서 메시지 전송
 */
export async function sendSlackMessage(
	message: SlackMessage | string,
	hookUrl?: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// Hook URL 가져오기 (파라미터 또는 환경변수에서)
		const slackHookUrl = hookUrl || process.env.SLACK_HOOK_URL;

		if (!slackHookUrl) {
			return {
				success: false,
				error:
					'SLACK_HOOK_URL 환경변수가 설정되지 않았습니다. MCP 서버 설정에서 env.SLACK_HOOK_URL을 추가해주세요.'
			};
		}

		// 메시지 형식 맞추기
		const payload: SlackMessage =
			typeof message === 'string' ? { text: message } : message;

		// HTTP 요청 전송
		const response = await fetch(slackHookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				success: false,
				error: `Slack API 오류 (${response.status}): ${errorText}`
			};
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: `네트워크 오류: ${
				error instanceof Error ? error.message : String(error)
			}`
		};
	}
}

/**
 * 태스크 완료 알림을 Slack으로 전송
 */
export async function notifyTaskCompletion(
	taskId: string,
	taskName: string,
	projectName?: string
): Promise<{ success: boolean; error?: string }> {
	const message: SlackMessage = {
		text: `✅ 태스크 완료!`,
		username: 'Task Actions Bot',
		icon_emoji: ':white_check_mark:',
		attachments: [
			{
				color: 'good',
				title: '태스크 정보',
				fields: [
					{
						title: '태스크 ID',
						value: taskId,
						short: true
					},
					{
						title: '태스크 이름',
						value: taskName,
						short: true
					},
					...(projectName
						? [
								{
									title: '프로젝트',
									value: projectName,
									short: true
								}
						  ]
						: [])
				]
			}
		]
	};

	return await sendSlackMessage(message);
}

/**
 * 프로젝트 초기화 알림을 Slack으로 전송
 */
export async function notifyProjectInit(
	projectName: string,
	author: string
): Promise<{ success: boolean; error?: string }> {
	const message: SlackMessage = {
		text: `🚀 새 프로젝트가 초기화되었습니다!`,
		username: 'Task Actions Bot',
		icon_emoji: ':rocket:',
		attachments: [
			{
				color: '#36a64f',
				title: '프로젝트 정보',
				fields: [
					{
						title: '프로젝트 이름',
						value: projectName,
						short: true
					},
					{
						title: '작성자',
						value: author,
						short: true
					}
				]
			}
		]
	};

	return await sendSlackMessage(message);
}
