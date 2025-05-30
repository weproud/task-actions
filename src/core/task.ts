import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { promisify } from 'util';
import { notifyTaskCompletion, notifyTaskCompletionDiscord } from './utils';

const execAsync = promisify(exec);

interface TaskConfig {
	version: number;
	kind: string;
	id: string;
	name: string;
	description?: string;
	status: string;
	jobs: {
		workflow?: string;
		rules?: string[];
		mcps?: string[];
	};
	systemprompt?: string;
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

export async function startTask(taskId: string): Promise<void> {
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

		// YAML 객체 구성
		const yamlObject = await buildTaskYamlObject(taskConfig);

		// YAML을 예쁘게 포맷팅
		const yamlOutput = yaml.dump(yamlObject, {
			indent: 2,
			flowLevel: -1,
			lineWidth: -1,
			noRefs: true,
			skipInvalid: true
		});

		console.log('\n' + '='.repeat(80));
		console.log('🎯 Task YAML 구조 (Prompt 포함)');
		console.log('='.repeat(80));
		console.log(yamlOutput);
		console.log('='.repeat(80));
	} catch (error) {
		console.error('❌ Task 시작 중 오류가 발생했습니다:', error);
		throw error;
	}
}

async function collectWorkflowPromptsOnly(
	workflowPath: string
): Promise<string[]> {
	const prompts: string[] = [];
	const fullPath = path.join('.task-actions', workflowPath);

	try {
		const workflowContent = await fs.readFile(fullPath, 'utf-8');
		const workflowConfig: WorkflowConfig = yaml.load(
			workflowContent
		) as WorkflowConfig;

		// Workflow 자체의 설명만 추가 (헤더 없이)
		prompts.push(workflowConfig.description);

		// 각 step에서 uses 또는 prompt가 있는 경우 재귀적으로 수집
		for (const step of workflowConfig.jobs.steps) {
			if (step.uses) {
				// uses에 지정된 action 파일의 prompt 수집 (헤더 없이)
				const actionPrompt = await collectActionPromptOnly(step.uses);
				if (actionPrompt) {
					prompts.push(actionPrompt);
				}
			} else if (step.prompt) {
				// 직접 지정된 prompt 파일 수집 (헤더 없이)
				const actionPrompt = await collectActionPromptOnly(step.prompt);
				if (actionPrompt) {
					prompts.push(actionPrompt);
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

async function collectActionPromptOnly(
	actionPath: string
): Promise<string | null> {
	const fullPath = path.join('.task-actions', actionPath);

	try {
		const actionContent = await fs.readFile(fullPath, 'utf-8');
		const actionConfig: ActionConfig = yaml.load(actionContent) as ActionConfig;

		// 헤더 없이 prompt만 반환
		return actionConfig.prompt;
	} catch (error) {
		console.warn(`⚠️  Action 파일을 읽는 중 오류 발생: ${actionPath}`, error);
		return null;
	}
}

async function collectRulePromptOnly(rulePath: string): Promise<string | null> {
	const fullPath = path.join('.task-actions', rulePath);

	try {
		const ruleContent = await fs.readFile(fullPath, 'utf-8');
		const ruleConfig: RuleConfig = yaml.load(ruleContent) as RuleConfig;

		// 헤더 없이 prompt만 반환
		return ruleConfig.prompt;
	} catch (error) {
		console.warn(`⚠️  Rule 파일을 읽는 중 오류 발생: ${rulePath}`, error);
		return null;
	}
}

async function collectMcpPromptOnly(mcpPath: string): Promise<string | null> {
	const fullPath = path.join('.task-actions', mcpPath);

	try {
		const mcpContent = await fs.readFile(fullPath, 'utf-8');
		const mcpConfig: McpConfig = yaml.load(mcpContent) as McpConfig;

		// 헤더 없이 prompt만 반환
		return mcpConfig.prompt;
	} catch (error) {
		console.warn(`⚠️  MCP 파일을 읽는 중 오류 발생: ${mcpPath}`, error);
		return null;
	}
}

/**
 * 태스크를 완료로 표시하고 알림을 전송합니다
 */
export async function completeTask(taskId: string): Promise<void> {
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
		if (taskConfig.status === 'done') {
			console.log(`ℹ️  Task "${taskConfig.name}"는 이미 완료되었습니다.`);
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

		// Slack 알림 전송
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

		// Discord 알림 전송
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

export async function showTask(taskId: string): Promise<void> {
	try {
		console.log(`🔍 Task "${taskId}"의 구조와 prompt를 표시합니다...\n`);

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

		// YAML 객체 구성
		const yamlObject = await buildTaskYamlObject(taskConfig);

		// YAML을 예쁘게 포맷팅해서 출력
		const prettyYaml = yaml.dump(yamlObject, {
			indent: 2,
			flowLevel: -1,
			lineWidth: -1,
			noRefs: true,
			skipInvalid: true
		});

		console.log('\n' + '='.repeat(80));
		console.log('🎯 Task YAML 구조 (Prompt 포함)');
		console.log('='.repeat(80));
		console.log(prettyYaml);
		console.log('='.repeat(80));
	} catch (error) {
		console.error('❌ Task 구조 표시 중 오류가 발생했습니다:', error);
		throw error;
	}
}

/**
 * Task 설정을 기반으로 YAML 객체를 구성합니다
 */
async function buildTaskYamlObject(taskConfig: TaskConfig): Promise<any> {
	const yamlObject: any = {
		version: taskConfig.version,
		kind: taskConfig.kind,
		id: taskConfig.id,
		name: taskConfig.name,
		status: taskConfig.status,
		jobs: {}
	};

	// description이 있는 경우에만 추가
	if (taskConfig.description) {
		yamlObject.description = taskConfig.description;
	}

	// Workflow prompt 수집 및 추가
	if (taskConfig.jobs.workflow) {
		const workflowPrompts = await collectWorkflowPromptsOnly(
			taskConfig.jobs.workflow
		);
		const combinedWorkflowPrompt = workflowPrompts.join('\n\n');
		yamlObject.jobs.workflow = combinedWorkflowPrompt;
	}

	// Rules prompts 수집 및 추가
	if (taskConfig.jobs.rules && taskConfig.jobs.rules.length > 0) {
		yamlObject.jobs.rules = [];
		for (const rulePath of taskConfig.jobs.rules) {
			const rulePrompt = await collectRulePromptOnly(rulePath);
			if (rulePrompt) {
				yamlObject.jobs.rules.push(rulePrompt);
			}
		}
	}

	// MCPs prompts 수집 및 추가
	if (taskConfig.jobs.mcps && taskConfig.jobs.mcps.length > 0) {
		yamlObject.jobs.mcps = [];
		for (const mcpPath of taskConfig.jobs.mcps) {
			const mcpPrompt = await collectMcpPromptOnly(mcpPath);
			if (mcpPrompt) {
				yamlObject.jobs.mcps.push(mcpPrompt);
			}
		}
	}

	// systemprompt 추가
	if (taskConfig.systemprompt) {
		yamlObject.systemprompt = taskConfig.systemprompt;
	}

	// prompt 추가
	yamlObject.prompt = taskConfig.prompt;

	return yamlObject;
}
