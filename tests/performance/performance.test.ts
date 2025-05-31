import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { createTempDir, cleanupTempDir } from '../helpers/test-utils';

const execAsync = promisify(exec);

describe('Performance Tests', () => {
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

	describe('Command Execution Performance', () => {
		it('should initialize project within reasonable time', async () => {
			const startTime = Date.now();
			
			await execAsync(`node ${cliPath} init`);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 초기화는 5초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(5000);
			console.log(`Init execution time: ${executionTime}ms`);
		});

		it('should generate files efficiently', async () => {
			await execAsync(`node ${cliPath} init`);
			
			const startTime = Date.now();
			
			// 모든 타입의 파일 생성
			await Promise.all([
				execAsync(`node ${cliPath} add action`),
				execAsync(`node ${cliPath} add workflow`),
				execAsync(`node ${cliPath} add mcp`),
				execAsync(`node ${cliPath} add rule`)
			]);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 모든 파일 생성은 10초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(10000);
			console.log(`File generation time: ${executionTime}ms`);
		});

		it('should validate project quickly', async () => {
			await execAsync(`node ${cliPath} init`);
			await execAsync(`node ${cliPath} add action`);
			await execAsync(`node ${cliPath} add workflow`);
			
			const startTime = Date.now();
			
			await execAsync(`node ${cliPath} validate`);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 검증은 3초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(3000);
			console.log(`Validation time: ${executionTime}ms`);
		});

		it('should check status quickly', async () => {
			await execAsync(`node ${cliPath} init`);
			
			const startTime = Date.now();
			
			await execAsync(`node ${cliPath} status --detailed`);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 상태 확인은 2초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(2000);
			console.log(`Status check time: ${executionTime}ms`);
		});
	});

	describe('Large Scale Operations', () => {
		it('should handle multiple task creation efficiently', async () => {
			await execAsync(`node ${cliPath} init`);
			
			const startTime = Date.now();
			
			// 100개의 태스크 생성
			const taskPromises = [];
			for (let i = 0; i < 100; i++) {
				taskPromises.push(
					execAsync(`node ${cliPath} add task test-task-${i}`)
				);
			}
			
			await Promise.all(taskPromises);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 100개 태스크 생성은 30초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(30000);
			console.log(`100 tasks creation time: ${executionTime}ms`);
			
			// tasks.yaml 파일 크기 확인
			const tasksFile = path.join('.task-actions', 'tasks.yaml');
			const stats = fs.statSync(tasksFile);
			console.log(`Tasks file size: ${stats.size} bytes`);
		});

		it('should handle large directory structures efficiently', async () => {
			await execAsync(`node ${cliPath} init`);
			
			// 많은 파일이 있는 상황 시뮬레이션
			const actionsDir = path.join('.task-actions', 'actions');
			fs.mkdirSync(actionsDir, { recursive: true });
			
			// 1000개의 더미 YAML 파일 생성
			for (let i = 0; i < 1000; i++) {
				const filePath = path.join(actionsDir, `dummy-action-${i}.yaml`);
				fs.writeFileSync(filePath, `name: dummy-action-${i}\ndescription: Dummy action ${i}`);
			}
			
			const startTime = Date.now();
			
			await execAsync(`node ${cliPath} validate`);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 1000개 파일 검증은 15초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(15000);
			console.log(`1000 files validation time: ${executionTime}ms`);
		});
	});

	describe('Memory Usage', () => {
		it('should not consume excessive memory during operations', async () => {
			const initialMemory = process.memoryUsage();
			
			await execAsync(`node ${cliPath} init`);
			await execAsync(`node ${cliPath} add action`);
			await execAsync(`node ${cliPath} add workflow`);
			await execAsync(`node ${cliPath} add mcp`);
			await execAsync(`node ${cliPath} add rule`);
			
			// 여러 번의 검증 실행
			for (let i = 0; i < 10; i++) {
				await execAsync(`node ${cliPath} validate`);
			}
			
			const finalMemory = process.memoryUsage();
			const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
			
			console.log(`Memory increase: ${memoryIncrease / 1024 / 1024} MB`);
			
			// 메모리 증가는 100MB 이내여야 함
			expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
		});
	});

	describe('Concurrent Operations', () => {
		it('should handle concurrent command execution', async () => {
			await execAsync(`node ${cliPath} init`);
			
			const startTime = Date.now();
			
			// 동시에 여러 명령어 실행
			const promises = [
				execAsync(`node ${cliPath} status`),
				execAsync(`node ${cliPath} list`),
				execAsync(`node ${cliPath} validate`),
				execAsync(`node ${cliPath} add task concurrent-test-1`),
				execAsync(`node ${cliPath} add task concurrent-test-2`)
			];
			
			const results = await Promise.all(promises);
			
			const endTime = Date.now();
			const executionTime = endTime - startTime;
			
			// 동시 실행은 10초 이내에 완료되어야 함
			expect(executionTime).toBeLessThan(10000);
			console.log(`Concurrent execution time: ${executionTime}ms`);
			
			// 모든 명령어가 성공적으로 실행되었는지 확인
			results.forEach((result, index) => {
				expect(result.stdout.length).toBeGreaterThan(0);
			});
		});
	});

	describe('File I/O Performance', () => {
		it('should efficiently read and write large YAML files', async () => {
			await execAsync(`node ${cliPath} init`);
			
			// 큰 YAML 파일 생성
			const largeYamlContent = Array(10000).fill(0).map((_, i) => 
				`task-${i}:\n  name: Task ${i}\n  description: Description for task ${i}`
			).join('\n');
			
			const largeYamlPath = path.join('.task-actions', 'large-tasks.yaml');
			
			const writeStartTime = Date.now();
			fs.writeFileSync(largeYamlPath, largeYamlContent);
			const writeEndTime = Date.now();
			
			const readStartTime = Date.now();
			const readContent = fs.readFileSync(largeYamlPath, 'utf8');
			const readEndTime = Date.now();
			
			const writeTime = writeEndTime - writeStartTime;
			const readTime = readEndTime - readStartTime;
			
			console.log(`Large file write time: ${writeTime}ms`);
			console.log(`Large file read time: ${readTime}ms`);
			console.log(`File size: ${readContent.length} characters`);
			
			// 쓰기와 읽기 모두 1초 이내에 완료되어야 함
			expect(writeTime).toBeLessThan(1000);
			expect(readTime).toBeLessThan(1000);
			expect(readContent.length).toBe(largeYamlContent.length);
		});
	});
});
