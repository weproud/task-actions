import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	jest
} from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import { TaskActionsTools } from '../../../mcp-server/src/tools';
import { mockProcessExecution } from '../../helpers/test-utils';

// child_process와 util 모킹
jest.mock('child_process');
jest.mock('util');

const mockExec = exec as jest.MockedFunction<typeof exec>;
const mockPromisify = promisify as jest.MockedFunction<typeof promisify>;

describe('TaskActionsTools', () => {
	let tools: TaskActionsTools;
	let mockExecAsync: jest.MockedFunction<any>;

	beforeEach(() => {
		// execAsync mock 함수 생성
		mockExecAsync = jest.fn();

		// promisify가 execAsync를 반환하도록 설정
		mockPromisify.mockReturnValue(mockExecAsync);

		// tools 인스턴스 생성 전에 mock 설정
		jest.clearAllMocks();
		tools = new TaskActionsTools();
	});

	describe('initProject', () => {
		it('should execute init command successfully', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '프로젝트 초기화가 완료되었습니다.',
				stderr: ''
			});

			const result = await tools.initProject();

			expect(result).toContain('프로젝트 초기화가 완료되었습니다');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('init'),
				expect.any(Object)
			);
		});

		it('should handle init command error', async () => {
			mockExecAsync.mockRejectedValue(new Error('Command failed'));

			await expect(tools.initProject()).rejects.toThrow('Command failed');
		});
	});

	describe('listTemplates', () => {
		it('should list all templates', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '사용 가능한 템플릿:\n- action\n- workflow\n- mcp\n- rule',
				stderr: ''
			});

			const result = await tools.listTemplates();

			expect(result).toContain('사용 가능한 템플릿');
			expect(result).toContain('action');
			expect(result).toContain('workflow');
		});

		it('should list templates by type', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: 'Action 템플릿:\n- create-branch\n- git-commit',
				stderr: ''
			});

			const result = await tools.listTemplates('action');

			expect(result).toContain('Action 템플릿');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('list --type action'),
				expect.any(Object)
			);
		});
	});

	describe('checkStatus', () => {
		it('should check project status', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '📊 프로젝트 상태:\n✅ 프로젝트가 초기화되었습니다.',
				stderr: ''
			});

			const result = await tools.checkStatus();

			expect(result).toContain('프로젝트 상태');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('status'),
				expect.any(Object)
			);
		});

		it('should check detailed status', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '📊 프로젝트 상태:\n디렉토리 구조:\n.task-actions/',
				stderr: ''
			});

			const result = await tools.checkStatus(true);

			expect(result).toContain('디렉토리 구조');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('status --detailed'),
				expect.any(Object)
			);
		});
	});

	describe('validateProject', () => {
		it('should validate project successfully', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '✅ 프로젝트 검증이 완료되었습니다.\n모든 파일이 유효합니다.',
				stderr: ''
			});

			const result = await tools.validateProject();

			expect(result).toContain('검증이 완료되었습니다');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('validate'),
				expect.any(Object)
			);
		});

		it('should handle validation errors', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '❌ 검증 실패\n잘못된 YAML 파일이 발견되었습니다.',
				stderr: ''
			});

			const result = await tools.validateProject();

			expect(result).toContain('검증 실패');
		});
	});

	describe('startTask', () => {
		it('should start task with basic options', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '🚀 태스크 시작: test-task\n태스크 내용이 출력되었습니다.',
				stderr: ''
			});

			const result = await tools.startTask('test-task');

			expect(result).toContain('태스크 시작');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('start task test-task'),
				expect.any(Object)
			);
		});

		it('should start task with enhanced mode', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '🚀 태스크 시작 (향상된 모드): test-task',
				stderr: ''
			});

			const result = await tools.startTask('test-task', undefined, false, true);

			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('start task test-task --enhanced'),
				expect.any(Object)
			);
		});

		it('should start task with output file', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '태스크가 파일로 저장되었습니다: output.txt',
				stderr: ''
			});

			const result = await tools.startTask('test-task', 'output.txt');

			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('start task test-task --output output.txt'),
				expect.any(Object)
			);
		});

		it('should start task with clipboard option', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '태스크가 클립보드에 복사되었습니다.',
				stderr: ''
			});

			const result = await tools.startTask('test-task', undefined, true);

			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('start task test-task --clipboard'),
				expect.any(Object)
			);
		});
	});

	describe('sendSlackMessage', () => {
		it('should send slack message', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '✅ Slack 메시지가 전송되었습니다.',
				stderr: ''
			});

			const result = await tools.sendSlackMessage('Test message');

			expect(result).toContain('Slack 메시지가 전송되었습니다');
			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining('slack --message "Test message"'),
				expect.any(Object)
			);
		});

		it('should send slack message to specific channel', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: '✅ Slack 메시지가 #general 채널에 전송되었습니다.',
				stderr: ''
			});

			const result = await tools.sendSlackMessage('Test message', '#general');

			expect(mockExecAsync).toHaveBeenCalledWith(
				expect.stringContaining(
					'slack --message "Test message" --channel #general'
				),
				expect.any(Object)
			);
		});
	});

	describe('executeCli', () => {
		it('should handle command timeout', async () => {
			mockExecAsync.mockRejectedValue(new Error('Command timed out'));

			await expect(tools.checkStatus()).rejects.toThrow('Command timed out');
		});

		it('should include stderr in output when available', async () => {
			mockExecAsync.mockResolvedValue({
				stdout: 'Success output',
				stderr: 'Warning: deprecated option'
			});

			const result = await tools.checkStatus();

			expect(result).toContain('Success output');
			expect(result).toContain('Warnings/Errors:');
			expect(result).toContain('Warning: deprecated option');
		});
	});
});
