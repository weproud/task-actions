import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';
import { notifyTaskCompletion, notifyTaskCompletionDiscord } from './utils';

const execAsync = promisify(exec);

interface TaskConfig {
	version: number;
	kind: string;
	id: string;
	name: string;
	status: string;
	jobs: {
		workflow?: string;
		rules?: string[];
		mcps?: string[];
	};
	prompt: string;
}

interface WorkflowConfig {
	version: number;
	kind: string;
	name: string;
	description: string;
	jobs: {
		steps: Array<{
			name: string;
			uses?: string;
			prompt?: string;
		}>;
	};
}

interface ActionConfig {
	version: number;
	kind: string;
	name: string;
	description: string;
	prompt: string;
}

interface RuleConfig {
	version: number;
	kind: string;
	name: string;
	description: string;
	prompt: string;
}

interface McpConfig {
	version: number;
	kind: string;
	name: string;
	description: string;
	prompt: string;
}

interface StartTaskOptions {
	output?: string;
	clipboard?: boolean;
}

export async function startTask(
	taskId: string,
	options: StartTaskOptions = {}
): Promise<void> {
	try {
		console.log(`🚀 Task "${taskId}"를 시작합니다...\n`);

		const taskConfigPath = path.join('.task-actions', `task-${taskId}.yaml`);

		// 파일이 존재하는지 확인
		try {
			await fs.access(taskConfigPath);
		} catch (error) {
			console.error(`❌ Task 파일을 찾을 수 없습니다: ${taskConfigPath}`);
			return;
		}

		const taskConfigContent = await fs.readFile(taskConfigPath, 'utf-8');
		const taskConfig: TaskConfig = yaml.load(taskConfigContent) as TaskConfig;

		console.log(`📋 Task: ${taskConfig.name}`);
		console.log(`📝 Status: ${taskConfig.status}\n`);

		// 개발용 prompt 수집
		const prompts: string[] = [];

		// 1. Task 자체의 prompt 추가
		prompts.push(`# Task: ${taskConfig.name}\n${taskConfig.prompt}`);

		// 2. Workflow의 prompt들을 재귀적으로 수집
		if (taskConfig.jobs.workflow) {
			console.log(`📄 Workflow 파일을 읽는 중: ${taskConfig.jobs.workflow}`);
			const workflowPrompts = await collectWorkflowPrompts(
				taskConfig.jobs.workflow
			);
			prompts.push(...workflowPrompts);
		}

		// 3. Rules의 prompt들 수집
		if (taskConfig.jobs.rules) {
			for (const rulePath of taskConfig.jobs.rules) {
				console.log(`📜 Rules 파일을 읽는 중: ${rulePath}`);
				const rulePrompt = await collectRulePrompt(rulePath);
				if (rulePrompt) {
					prompts.push(rulePrompt);
				}
			}
		}

		// 4. MCPs의 prompt들 수집
		if (taskConfig.jobs.mcps) {
			for (const mcpPath of taskConfig.jobs.mcps) {
				console.log(`🔧 MCP 파일을 읽는 중: ${mcpPath}`);
				const mcpPrompt = await collectMcpPrompt(mcpPath);
				if (mcpPrompt) {
					prompts.push(mcpPrompt);
				}
			}
		}

		// 5. 최종 prompt 생성
		const finalPrompt = generateDevelopmentPrompt(taskConfig, prompts);

		console.log('\n' + '='.repeat(80));
		console.log('🎯 개발용 통합 Prompt');
		console.log('='.repeat(80));
		console.log(finalPrompt);
		console.log('='.repeat(80));

		// 파일 저장 옵션
		if (options.output) {
			await fs.writeFile(options.output, finalPrompt, 'utf-8');
			console.log(
				`\n📄 개발용 통합 Prompt를 파일에 저장했습니다: ${options.output}`
			);
		}

		// 클립보드 복사 옵션 (macOS만 지원)
		if (options.clipboard) {
			try {
				// 임시 파일을 사용하여 안전하게 클립보드에 복사
				const tempFile = path.join('/tmp', `task-${taskId}-prompt.txt`);
				await fs.writeFile(tempFile, finalPrompt, 'utf-8');
				await execAsync(`cat "${tempFile}" | pbcopy`);
				await fs.unlink(tempFile); // 임시 파일 삭제
				console.log('\n📋 개발용 통합 Prompt를 클립보드에 복사했습니다');
			} catch (clipboardError) {
				console.warn(
					'\n⚠️  클립보드 복사에 실패했습니다. macOS에서만 지원됩니다.'
				);
			}
		}
	} catch (error) {
		console.error('❌ Task 시작 중 오류가 발생했습니다:', error);
		throw error;
	}
}

async function collectWorkflowPrompts(workflowPath: string): Promise<string[]> {
	const prompts: string[] = [];
	const fullPath = path.join('.task-actions', workflowPath);

	try {
		const workflowContent = await fs.readFile(fullPath, 'utf-8');
		const workflowConfig: WorkflowConfig = yaml.load(
			workflowContent
		) as WorkflowConfig;

		// Workflow 자체의 설명 추가
		prompts.push(
			`## Workflow: ${workflowConfig.name}\n${workflowConfig.description}`
		);

		// 각 step에서 uses 또는 prompt가 있는 경우 재귀적으로 수집
		for (const step of workflowConfig.jobs.steps) {
			if (step.uses) {
				// uses에 지정된 action 파일의 prompt 수집
				const actionPrompt = await collectActionPrompt(step.uses);
				if (actionPrompt) {
					prompts.push(`### Step: ${step.name}\n${actionPrompt}`);
				}
			} else if (step.prompt) {
				// 직접 지정된 prompt 파일 수집
				const actionPrompt = await collectActionPrompt(step.prompt);
				if (actionPrompt) {
					prompts.push(`### Step: ${step.name}\n${actionPrompt}`);
				}
			}
		}
	} catch (error) {
		console.warn(
			`⚠️  Workflow 파일을 읽는 중 오류 발생: ${workflowPath}`,
			error
		);
	}

	return prompts;
}

async function collectActionPrompt(actionPath: string): Promise<string | null> {
	const fullPath = path.join('.task-actions', actionPath);

	try {
		const actionContent = await fs.readFile(fullPath, 'utf-8');
		const actionConfig: ActionConfig = yaml.load(actionContent) as ActionConfig;

		return `#### Action: ${actionConfig.name}\n${actionConfig.description}\n${actionConfig.prompt}`;
	} catch (error) {
		console.warn(`⚠️  Action 파일을 읽는 중 오류 발생: ${actionPath}`, error);
		return null;
	}
}

async function collectRulePrompt(rulePath: string): Promise<string | null> {
	const fullPath = path.join('.task-actions', rulePath);

	try {
		const ruleContent = await fs.readFile(fullPath, 'utf-8');
		const ruleConfig: RuleConfig = yaml.load(ruleContent) as RuleConfig;

		return `## Rule: ${ruleConfig.name}\n${ruleConfig.description}\n${ruleConfig.prompt}`;
	} catch (error) {
		console.warn(`⚠️  Rule 파일을 읽는 중 오류 발생: ${rulePath}`, error);
		return null;
	}
}

async function collectMcpPrompt(mcpPath: string): Promise<string | null> {
	const fullPath = path.join('.task-actions', mcpPath);

	try {
		const mcpContent = await fs.readFile(fullPath, 'utf-8');
		const mcpConfig: McpConfig = yaml.load(mcpContent) as McpConfig;

		return `## MCP: ${mcpConfig.name}\n${mcpConfig.description}\n${mcpConfig.prompt}`;
	} catch (error) {
		console.warn(`⚠️  MCP 파일을 읽는 중 오류 발생: ${mcpPath}`, error);
		return null;
	}
}

function generateDevelopmentPrompt(
	taskConfig: TaskConfig,
	prompts: string[]
): string {
	const timestamp = new Date().toISOString();

	return `# 🎯 Task Development Prompt

## Task Information
- **ID**: ${taskConfig.id}
- **Name**: ${taskConfig.name}
- **Status**: ${taskConfig.status}
- **Generated**: ${timestamp}

## Task Requirements
${taskConfig.prompt}

---

${prompts.join('\n\n---\n\n')}

---

## 개발 지침
위의 모든 정보를 종합하여 Task "${taskConfig.name}"을 개발하세요.

1. **Task 요구사항**을 주의 깊게 분석하세요
2. **Workflow 단계**를 따라 체계적으로 진행하세요  
3. **Rules**에 명시된 개발 규칙을 준수하세요
4. **MCPs**를 적극적으로 활용하여 효율적으로 개발하세요

**시작 시간**: ${timestamp}
**다음 단계**: 개발 환경 설정 및 기본 구조 생성

Good luck! 🚀`;
}

/**
 * 태스크 완료 인터페이스
 */
interface CompleteTaskOptions {
	skipSlack?: boolean;
	skipDiscord?: boolean;
	force?: boolean;
}

/**
 * 태스크를 완료로 표시하고 Slack 알림을 전송합니다
 */
export async function completeTask(
	taskId: string,
	options: CompleteTaskOptions = {}
): Promise<void> {
	try {
		console.log(`✅ Task "${taskId}"를 완료 처리합니다...\n`);

		const taskConfigPath = path.join('.task-actions', `task-${taskId}.yaml`);

		// 파일이 존재하는지 확인
		try {
			await fs.access(taskConfigPath);
		} catch (error) {
			console.error(`❌ Task 파일을 찾을 수 없습니다: ${taskConfigPath}`);
			return;
		}

		// 태스크 설정 파일 읽기
		const taskConfigContent = await fs.readFile(taskConfigPath, 'utf-8');
		const taskConfig: TaskConfig = yaml.load(taskConfigContent) as TaskConfig;

		// 이미 완료된 태스크인지 확인
		if (taskConfig.status === 'done' && !options.force) {
			console.log(`ℹ️  Task "${taskConfig.name}"는 이미 완료되었습니다.`);
			console.log(`   강제로 다시 완료 처리하려면 --force 옵션을 사용하세요.`);
			return;
		}

		console.log(`📋 Task: ${taskConfig.name}`);
		console.log(`📝 이전 상태: ${taskConfig.status}`);

		// 태스크 상태를 'done'으로 변경
		taskConfig.status = 'done';

		// 수정된 설정을 파일에 저장
		const updatedYamlContent = yaml.dump(taskConfig, {
			indent: 2,
			flowLevel: -1
		});

		await fs.writeFile(taskConfigPath, updatedYamlContent, 'utf-8');
		console.log(`✅ 태스크 상태가 'done'으로 변경되었습니다.`);

		// tasks.yaml 파일도 업데이트
		await updateTasksStatus(taskId, 'done');

		// 프로젝트 정보 가져오기
		let projectName = 'Unknown Project';
		try {
			const varsPath = path.join('.task-actions', 'vars.yaml');
			const varsContent = await fs.readFile(varsPath, 'utf-8');
			const vars = yaml.load(varsContent) as any;
			projectName = vars.project?.name || projectName;
		} catch (error) {
			console.warn('⚠️  프로젝트 정보를 가져올 수 없습니다.');
		}

		// Slack 알림 전송 (옵션에 따라)
		if (!options.skipSlack) {
			console.log('\n📤 Slack 알림을 전송합니다...');

			const slackResult = await notifyTaskCompletion(
				taskConfig.id,
				taskConfig.name,
				projectName
			);

			if (slackResult.success) {
				console.log('✅ Slack 알림이 성공적으로 전송되었습니다.');
			} else {
				console.warn(`⚠️  Slack 알림 전송 실패: ${slackResult.error}`);
				console.warn('   태스크는 정상적으로 완료되었습니다.');
			}
		} else {
			console.log('\n📤 Slack 알림이 건너뛰어졌습니다.');
		}

		// Discord 알림 전송 (옵션에 따라)
		if (!options.skipDiscord) {
			console.log('\n📤 Discord 알림을 전송합니다...');

			const discordResult = await notifyTaskCompletionDiscord(
				taskConfig.id,
				taskConfig.name,
				projectName
			);

			if (discordResult.success) {
				console.log('✅ Discord 알림이 성공적으로 전송되었습니다.');
			} else {
				console.warn(`⚠️  Discord 알림 전송 실패: ${discordResult.error}`);
				console.warn('   태스크는 정상적으로 완료되었습니다.');
			}
		} else {
			console.log('\n📤 Discord 알림이 건너뛰어졌습니다.');
		}

		console.log(`\n🎉 Task "${taskConfig.name}"이 성공적으로 완료되었습니다!`);
	} catch (error) {
		console.error('❌ Task 완료 처리 중 오류가 발생했습니다:', error);
		throw error;
	}
}

/**
 * tasks.yaml 파일에서 태스크 상태를 업데이트합니다
 */
async function updateTasksStatus(
	taskId: string,
	status: string
): Promise<void> {
	try {
		const tasksPath = path.join('.task-actions', 'tasks.yaml');

		// tasks.yaml 파일이 있는지 확인
		try {
			await fs.access(tasksPath);
		} catch (error) {
			console.warn('⚠️  tasks.yaml 파일을 찾을 수 없습니다.');
			return;
		}

		const tasksContent = await fs.readFile(tasksPath, 'utf-8');
		const tasksConfig = yaml.load(tasksContent) as any;

		// tasks 배열에서 해당 태스크 찾아서 상태 업데이트
		if (tasksConfig.tasks && Array.isArray(tasksConfig.tasks)) {
			const taskIndex = tasksConfig.tasks.findIndex(
				(task: any) => task.id === taskId
			);

			if (taskIndex !== -1) {
				tasksConfig.tasks[taskIndex].status = status;

				const updatedTasksContent = yaml.dump(tasksConfig, {
					indent: 2,
					flowLevel: -1
				});

				await fs.writeFile(tasksPath, updatedTasksContent, 'utf-8');
				console.log('✅ tasks.yaml 파일이 업데이트되었습니다.');
			} else {
				console.warn(
					`⚠️  tasks.yaml에서 태스크 ID "${taskId}"를 찾을 수 없습니다.`
				);
			}
		}
	} catch (error) {
		console.warn('⚠️  tasks.yaml 업데이트 중 오류 발생:', error);
	}
}
