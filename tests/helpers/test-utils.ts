import * as fs from 'fs';
import * as path from 'path';
import { jest } from '@jest/globals';

/**
 * 테스트용 임시 디렉토리 생성
 */
export function createTempDir(): string {
	const tempDir = path.join(
		__dirname,
		'..',
		'temp',
		`test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
	);
	fs.mkdirSync(tempDir, { recursive: true });
	return tempDir;
}

/**
 * 테스트용 임시 디렉토리 정리
 */
export function cleanupTempDir(tempDir: string): void {
	if (fs.existsSync(tempDir)) {
		fs.rmSync(tempDir, { recursive: true, force: true });
	}
}

/**
 * 파일 시스템 모킹 헬퍼
 */
export function mockFileSystem() {
	const mockFs = {
		existsSync: jest.fn(),
		readFileSync: jest.fn(),
		writeFileSync: jest.fn(),
		mkdirSync: jest.fn(),
		rmSync: jest.fn(),
		readdirSync: jest.fn(),
		statSync: jest.fn()
	};

	return mockFs;
}

/**
 * 콘솔 출력 캡처
 */
export function captureConsoleOutput() {
	const logs: string[] = [];
	const errors: string[] = [];
	const warns: string[] = [];

	const originalLog = console.log;
	const originalError = console.error;
	const originalWarn = console.warn;

	console.log = (...args: any[]) => {
		logs.push(args.join(' '));
	};

	console.error = (...args: any[]) => {
		errors.push(args.join(' '));
	};

	console.warn = (...args: any[]) => {
		warns.push(args.join(' '));
	};

	return {
		logs,
		errors,
		warns,
		restore: () => {
			console.log = originalLog;
			console.error = originalError;
			console.warn = originalWarn;
		}
	};
}

/**
 * 프로세스 실행 모킹
 */
export function mockProcessExecution() {
	const execMock = jest.fn() as jest.MockedFunction<any>;
	return {
		exec: execMock,
		mockSuccess: (stdout: string, stderr: string = '') => {
			execMock.mockResolvedValue({ stdout, stderr });
		},
		mockError: (error: Error) => {
			execMock.mockRejectedValue(error);
		}
	};
}

/**
 * 테스트용 변수 생성
 */
export function createTestVariables() {
	return {
		projectName: 'test-project',
		projectDescription: 'Test project description',
		author: 'Test Author',
		version: '1.0.0',
		slackWebhookUrl: 'https://hooks.slack.com/test',
		discordWebhookUrl: 'https://discord.com/api/webhooks/test'
	};
}

/**
 * 테스트용 YAML 파일 내용 생성
 */
export function createTestYamlContent() {
	return {
		action: `name: Test Action
description: Test action description
runs:
  using: node16
  main: index.js`,
		workflow: `name: Test Workflow
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3`,
		task: `id: test-task
name: Test Task
description: Test task description
steps:
  - name: Step 1
    action: test-action`
	};
}
