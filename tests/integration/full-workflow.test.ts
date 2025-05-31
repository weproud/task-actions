import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { createTempDir, cleanupTempDir } from '../helpers/test-utils';

const execAsync = promisify(exec);

describe.skip('Full Workflow Integration Tests', () => {
	let tempDir: string;
	let originalCwd: string;
	const cliPath = path.join(__dirname, '../../dist/cli.js');

	beforeEach(() => {
		tempDir = createTempDir();
		originalCwd = process.cwd();
		process.chdir(tempDir);
	});

	afterEach(() => {
		process.chdir(originalCwd);
		cleanupTempDir(tempDir);
	});

	describe('Complete Project Lifecycle', () => {
		it('should complete full project setup and validation', async () => {
			// 1. 프로젝트 초기화
			const initResult = await execAsync(`node ${cliPath} init`);
			expect(initResult.stdout).toContain('프로젝트 초기화');

			// 2. .task-actions 디렉토리 생성 확인
			expect(fs.existsSync('.task-actions')).toBe(true);
			expect(fs.existsSync('.task-actions/vars.yaml')).toBe(true);
			expect(fs.existsSync('.task-actions/tasks.yaml')).toBe(true);

			// 3. 상태 확인
			const statusResult = await execAsync(`node ${cliPath} status`);
			expect(statusResult.stdout).toContain('초기화되었습니다');

			// 4. 액션 파일 생성
			const actionResult = await execAsync(`node ${cliPath} add action`);
			expect(actionResult.stdout).toContain('action 파일들이 생성되었습니다');
			expect(fs.existsSync('.task-actions/actions')).toBe(true);

			// 5. 워크플로우 파일 생성
			const workflowResult = await execAsync(`node ${cliPath} add workflow`);
			expect(workflowResult.stdout).toContain(
				'workflow 파일들이 생성되었습니다'
			);
			expect(fs.existsSync('.task-actions/workflows')).toBe(true);

			// 6. MCP 파일 생성
			const mcpResult = await execAsync(`node ${cliPath} add mcp`);
			expect(mcpResult.stdout).toContain('mcp 파일들이 생성되었습니다');
			expect(fs.existsSync('.task-actions/mcps')).toBe(true);

			// 7. 룰 파일 생성
			const ruleResult = await execAsync(`node ${cliPath} add rule`);
			expect(ruleResult.stdout).toContain('rule 파일들이 생성되었습니다');
			expect(fs.existsSync('.task-actions/rules')).toBe(true);

			// 8. 태스크 생성
			const taskResult = await execAsync(
				`node ${cliPath} add task integration-test`
			);
			expect(taskResult.stdout).toContain('태스크가 생성되었습니다');

			// 9. 프로젝트 검증
			const validateResult = await execAsync(`node ${cliPath} validate`);
			expect(validateResult.stdout).toContain('검증');

			// 10. 템플릿 목록 확인
			const listResult = await execAsync(`node ${cliPath} list`);
			expect(listResult.stdout).toContain('템플릿');

			// 11. 상세 상태 확인
			const detailedStatusResult = await execAsync(
				`node ${cliPath} status --detailed`
			);
			expect(detailedStatusResult.stdout).toContain('디렉토리 구조');
		}, 30000); // 30초 타임아웃

		it('should handle project cleanup and re-initialization', async () => {
			// 1. 초기 프로젝트 설정
			await execAsync(`node ${cliPath} init`);
			await execAsync(`node ${cliPath} add action`);

			// 2. 파일 존재 확인
			expect(fs.existsSync('.task-actions')).toBe(true);
			expect(fs.existsSync('.task-actions/actions')).toBe(true);

			// 3. 프로젝트 정리
			const cleanResult = await execAsync(`node ${cliPath} clean`);
			expect(cleanResult.stdout).toContain('정리가 완료되었습니다');

			// 4. 파일 삭제 확인
			expect(fs.existsSync('.task-actions')).toBe(false);

			// 5. 재초기화
			await execAsync(`node ${cliPath} init`);
			expect(fs.existsSync('.task-actions')).toBe(true);

			// 6. 상태 확인
			const statusResult = await execAsync(`node ${cliPath} status`);
			expect(statusResult.stdout).toContain('초기화되었습니다');
		});

		it('should handle task creation and execution workflow', async () => {
			// 1. 프로젝트 초기화
			await execAsync(`node ${cliPath} init`);

			// 2. 여러 태스크 생성
			await execAsync(`node ${cliPath} add task user-auth`);
			await execAsync(`node ${cliPath} add task data-migration`);
			await execAsync(`node ${cliPath} add task api-integration`);

			// 3. tasks.yaml 파일 내용 확인
			const tasksContent = fs.readFileSync('.task-actions/tasks.yaml', 'utf8');
			expect(tasksContent).toContain('user-auth');
			expect(tasksContent).toContain('data-migration');
			expect(tasksContent).toContain('api-integration');

			// 4. 태스크 시작 (출력 파일로)
			const outputFile = path.join(tempDir, 'task-output.txt');
			const startResult = await execAsync(
				`node ${cliPath} start task user-auth --output ${outputFile}`
			);
			expect(startResult.stdout).toContain('태스크');

			// 5. 출력 파일 생성 확인
			if (fs.existsSync(outputFile)) {
				const outputContent = fs.readFileSync(outputFile, 'utf8');
				expect(outputContent.length).toBeGreaterThan(0);
			}
		});
	});

	describe('Error Handling', () => {
		it('should handle commands on uninitialized project', async () => {
			// 초기화되지 않은 프로젝트에서 명령어 실행
			const statusResult = await execAsync(`node ${cliPath} status`);
			expect(statusResult.stdout).toContain('초기화되지 않았습니다');

			try {
				await execAsync(`node ${cliPath} add action`);
			} catch (error: any) {
				expect(error.stdout || error.stderr).toContain('초기화');
			}
		});

		it('should handle invalid task IDs', async () => {
			await execAsync(`node ${cliPath} init`);

			try {
				await execAsync(`node ${cliPath} start task non-existent-task`);
			} catch (error: any) {
				expect(error.stdout || error.stderr).toContain('존재하지 않습니다');
			}
		});

		it('should validate YAML files and report errors', async () => {
			await execAsync(`node ${cliPath} init`);
			await execAsync(`node ${cliPath} add action`);

			// 잘못된 YAML 파일 생성
			const invalidYamlPath = path.join(
				'.task-actions',
				'actions',
				'invalid.yaml'
			);
			fs.writeFileSync(invalidYamlPath, 'invalid: yaml: content: [');

			try {
				const validateResult = await execAsync(`node ${cliPath} validate`);
				expect(validateResult.stdout).toContain('오류');
			} catch (error: any) {
				// 검증 실패는 예상된 동작
				expect(error.stdout || error.stderr).toContain('YAML');
			}
		});
	});

	describe('Template System Integration', () => {
		it('should generate files with correct variable substitution', async () => {
			await execAsync(`node ${cliPath} init`);
			await execAsync(`node ${cliPath} add action`);

			// 생성된 파일들의 내용 확인
			const actionsDir = path.join('.task-actions', 'actions');
			const actionFiles = fs.readdirSync(actionsDir);

			expect(actionFiles.length).toBeGreaterThan(0);

			// 첫 번째 액션 파일의 내용 확인
			const firstActionFile = path.join(actionsDir, actionFiles[0]);
			const actionContent = fs.readFileSync(firstActionFile, 'utf8');

			// 변수가 올바르게 치환되었는지 확인
			expect(actionContent).not.toContain('{{');
			expect(actionContent).not.toContain('}}');
			expect(actionContent.length).toBeGreaterThan(0);
		});

		it('should maintain consistent variable values across files', async () => {
			await execAsync(`node ${cliPath} init`);
			await execAsync(`node ${cliPath} add action`);
			await execAsync(`node ${cliPath} add workflow`);

			// vars.yaml에서 변수 읽기
			const varsContent = fs.readFileSync('.task-actions/vars.yaml', 'utf8');
			const projectNameMatch = varsContent.match(/projectName:\s*(.+)/);
			const authorMatch = varsContent.match(/author:\s*(.+)/);

			if (projectNameMatch && authorMatch) {
				const projectName = projectNameMatch[1].trim();
				const author = authorMatch[1].trim();

				// 액션 파일에서 변수 확인
				const actionFiles = fs.readdirSync('.task-actions/actions');
				const actionContent = fs.readFileSync(
					path.join('.task-actions/actions', actionFiles[0]),
					'utf8'
				);

				// 워크플로우 파일에서 변수 확인
				const workflowFiles = fs.readdirSync('.task-actions/workflows');
				const workflowContent = fs.readFileSync(
					path.join('.task-actions/workflows', workflowFiles[0]),
					'utf8'
				);

				// 일관성 확인 (실제 내용에 따라 조정 필요)
				expect(actionContent).toContain(projectName);
				expect(workflowContent).toContain(projectName);
			}
		});
	});
});
