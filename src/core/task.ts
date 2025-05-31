import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { promisify } from 'util';
import { notifyTaskCompletion, notifyTaskCompletionDiscord } from './utils';

const execAsync = promisify(exec);

/**
 * vars.yaml에서 use_enhanced_prompt 설정을 읽어옵니다
 */
async function getEnhancedPromptSetting(): Promise<boolean> {
	try {
		const varsPath = path.join('.task-actions', 'vars.yaml');
		const varsContent = await fs.readFile(varsPath, 'utf-8');
		const vars = yaml.load(varsContent) as any;
		return vars.development?.use_enhanced_prompt === true;
	} catch (error) {
		console.warn(
			'⚠️  vars.yaml 파일을 읽을 수 없습니다. 기본 prompt를 사용합니다.'
		);
		return false;
	}
}

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
	enhancedprompt?: string;
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

export async function startTask(
	taskId: string,
	enhanced?: boolean
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

		// enhanced 설정 결정 (우선순위: 매개변수 > vars.yaml > false)
		let useEnhanced = enhanced;
		if (useEnhanced === undefined) {
			useEnhanced = await getEnhancedPromptSetting();
		}

		// YAML 객체 구성
		const yamlObject = await buildTaskYamlObject(taskConfig, useEnhanced);

		// YAML을 예쁘게 포맷팅
		const yamlOutput = yaml.dump(yamlObject, {
			indent: 2,
			flowLevel: -1,
			lineWidth: -1,
			noRefs: true,
			skipInvalid: true
		});

		const promptType = useEnhanced ? 'Enhanced Prompt' : 'Basic Prompt';
		console.log('\n' + '='.repeat(80));
		console.log(`🎯 Task YAML Structure (${promptType})`);
		console.log('='.repeat(80));
		console.log(yamlOutput);
		console.log('='.repeat(80));
	} catch (error) {
		console.error('❌ Error occurred while starting task:', error);
		throw error;
	}
}

async function collectWorkflowPromptsOnly(
	workflowPath: string,
	useEnhanced: boolean = false
): Promise<string[]> {
	const prompts: string[] = [];
	const fullPath = path.join('.task-actions', workflowPath);

	try {
		const workflowContent = await fs.readFile(fullPath, 'utf-8');
		const workflowConfig: WorkflowConfig = yaml.load(
			workflowContent
		) as WorkflowConfig;

		// Add only workflow description (without header)
		prompts.push(workflowConfig.description);

		// Recursively collect from each step that has uses or prompt
		for (const step of workflowConfig.jobs.steps) {
			if (step.uses) {
				// Collect prompt from action file specified in uses (without header)
				const actionPrompt = await collectActionPromptOnly(
					step.uses,
					useEnhanced
				);
				if (actionPrompt) {
					prompts.push(actionPrompt);
				}
			} else if (step.prompt) {
				// Collect directly specified prompt file (without header)
				const actionPrompt = await collectActionPromptOnly(
					step.prompt,
					useEnhanced
				);
				if (actionPrompt) {
					prompts.push(actionPrompt);
				}
			}
		}
	} catch (error) {
		console.warn(`⚠️  Error reading workflow file: ${workflowPath}`, error);
	}

	return prompts;
}

async function collectActionPromptOnly(
	actionPath: string,
	useEnhanced: boolean = false
): Promise<string | null> {
	const fullPath = path.join('.task-actions', actionPath);

	try {
		const actionContent = await fs.readFile(fullPath, 'utf-8');
		const actionConfig: any = yaml.load(actionContent) as any;

		// Return enhanced prompt if available and requested, otherwise basic prompt
		if (useEnhanced && actionConfig.enhancedprompt) {
			return actionConfig.enhancedprompt;
		}
		return actionConfig.prompt;
	} catch (error) {
		console.warn(`⚠️  Error reading action file: ${actionPath}`, error);
		return null;
	}
}

async function collectRulePromptOnly(
	rulePath: string,
	useEnhanced: boolean = false
): Promise<string | null> {
	const fullPath = path.join('.task-actions', rulePath);

	try {
		const ruleContent = await fs.readFile(fullPath, 'utf-8');
		const ruleConfig: any = yaml.load(ruleContent) as any;

		// Return enhanced prompt if available and requested, otherwise basic prompt
		if (useEnhanced && ruleConfig.enhancedprompt) {
			return ruleConfig.enhancedprompt;
		}
		return ruleConfig.prompt;
	} catch (error) {
		console.warn(`⚠️  Error reading rule file: ${rulePath}`, error);
		return null;
	}
}

async function collectMcpPromptOnly(
	mcpPath: string,
	useEnhanced: boolean = false
): Promise<string | null> {
	const fullPath = path.join('.task-actions', mcpPath);

	try {
		const mcpContent = await fs.readFile(fullPath, 'utf-8');
		const mcpConfig: any = yaml.load(mcpContent) as any;

		// Return enhanced prompt if available and requested, otherwise basic prompt
		if (useEnhanced && mcpConfig.enhancedprompt) {
			return mcpConfig.enhancedprompt;
		}
		return mcpConfig.prompt;
	} catch (error) {
		console.warn(`⚠️  Error reading MCP file: ${mcpPath}`, error);
		return null;
	}
}

/**
 * Mark task as completed and send notifications
 */
export async function completeTask(taskId: string): Promise<void> {
	try {
		console.log(`✅ Processing task "${taskId}" as completed...\n`);

		const taskConfigPath = path.join('.task-actions', `task-${taskId}.yaml`);

		// Check if file exists
		try {
			await fs.access(taskConfigPath);
		} catch (error) {
			console.error(`❌ Task file not found: ${taskConfigPath}`);
			return;
		}

		// Read task configuration file
		const taskConfigContent = await fs.readFile(taskConfigPath, 'utf-8');
		const taskConfig: TaskConfig = yaml.load(taskConfigContent) as TaskConfig;

		// Check if task is already completed
		if (taskConfig.status === 'done') {
			console.log(`ℹ️  Task "${taskConfig.name}" is already completed.`);
			return;
		}

		console.log(`📋 Task: ${taskConfig.name}`);
		console.log(`📝 Previous status: ${taskConfig.status}`);

		// Change task status to 'done'
		taskConfig.status = 'done';

		// Save modified configuration to file
		const updatedYamlContent = yaml.dump(taskConfig, {
			indent: 2,
			flowLevel: -1
		});

		await fs.writeFile(taskConfigPath, updatedYamlContent, 'utf-8');
		console.log(`✅ Task status changed to 'done'.`);

		// Update tasks.yaml file as well
		await updateTasksStatus(taskId, 'done');

		// Get project information
		let projectName = 'Unknown Project';
		try {
			const varsPath = path.join('.task-actions', 'vars.yaml');
			const varsContent = await fs.readFile(varsPath, 'utf-8');
			const vars = yaml.load(varsContent) as any;
			projectName = vars.project?.name || projectName;
		} catch (error) {
			console.warn('⚠️  Unable to get project information.');
		}

		// Send Slack notification
		console.log('\n📤 Sending Slack notification...');

		const slackResult = await notifyTaskCompletion(
			taskConfig.id,
			taskConfig.name,
			projectName
		);

		if (slackResult.success) {
			console.log('✅ Slack notification sent successfully.');
		} else {
			console.warn(`⚠️  Slack notification failed: ${slackResult.error}`);
			console.warn('   Task completed successfully.');
		}

		// Send Discord notification
		console.log('\n📤 Sending Discord notification...');

		const discordResult = await notifyTaskCompletionDiscord(
			taskConfig.id,
			taskConfig.name,
			projectName
		);

		if (discordResult.success) {
			console.log('✅ Discord notification sent successfully.');
		} else {
			console.warn(`⚠️  Discord notification failed: ${discordResult.error}`);
			console.warn('   Task completed successfully.');
		}

		console.log(`\n🎉 Task "${taskConfig.name}" completed successfully!`);
	} catch (error) {
		console.error('❌ Error occurred while processing task completion:', error);
		throw error;
	}
}

/**
 * Update task status in tasks.yaml file
 */
async function updateTasksStatus(
	taskId: string,
	status: string
): Promise<void> {
	try {
		const tasksPath = path.join('.task-actions', 'tasks.yaml');

		// Check if tasks.yaml file exists
		try {
			await fs.access(tasksPath);
		} catch (error) {
			console.warn('⚠️  tasks.yaml file not found.');
			return;
		}

		const tasksContent = await fs.readFile(tasksPath, 'utf-8');
		const tasksConfig = yaml.load(tasksContent) as any;

		// Find and update task status in tasks array
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
				console.log('✅ tasks.yaml file updated.');
			} else {
				console.warn(`⚠️  Task ID "${taskId}" not found in tasks.yaml.`);
			}
		}
	} catch (error) {
		console.warn('⚠️  Error updating tasks.yaml:', error);
	}
}

export async function showTask(
	taskId: string,
	enhanced?: boolean
): Promise<void> {
	try {
		const taskConfigPath = path.join('.task-actions', `task-${taskId}.yaml`);

		// Check if file exists
		try {
			await fs.access(taskConfigPath);
		} catch (error) {
			console.error(`❌ Task file not found: ${taskConfigPath}`);
			return;
		}

		const taskConfigContent = await fs.readFile(taskConfigPath, 'utf-8');
		const taskConfig: TaskConfig = yaml.load(taskConfigContent) as TaskConfig;

		// enhanced 설정 결정 (우선순위: 매개변수 > vars.yaml > false)
		let useEnhanced = enhanced;
		if (useEnhanced === undefined) {
			useEnhanced = await getEnhancedPromptSetting();
		}

		// Build YAML object
		const yamlObject = await buildTaskYamlObject(taskConfig, useEnhanced);

		// Format and output YAML prettily
		const prettyYaml = yaml.dump(yamlObject, {
			indent: 2,
			flowLevel: -1,
			lineWidth: -1,
			noRefs: true,
			skipInvalid: true
		});

		console.log(prettyYaml);
	} catch (error) {
		console.error('❌ Error occurred while displaying task structure:', error);
		throw error;
	}
}

/**
 * Build YAML object based on Task configuration
 */
async function buildTaskYamlObject(
	taskConfig: TaskConfig,
	useEnhanced: boolean = false
): Promise<any> {
	const yamlObject: any = {
		version: taskConfig.version,
		kind: taskConfig.kind,
		id: taskConfig.id,
		name: taskConfig.name,
		status: taskConfig.status,
		jobs: {}
	};

	// Add description only if it exists
	if (taskConfig.description) {
		yamlObject.description = taskConfig.description;
	}

	// Collect and add workflow prompts
	if (taskConfig.jobs.workflow) {
		const workflowPrompts = await collectWorkflowPromptsOnly(
			taskConfig.jobs.workflow,
			useEnhanced
		);
		const combinedWorkflowPrompt = workflowPrompts.join('\n\n');
		yamlObject.jobs.workflow = combinedWorkflowPrompt;
	}

	// Collect and add rules prompts
	if (taskConfig.jobs.rules && taskConfig.jobs.rules.length > 0) {
		yamlObject.jobs.rules = [];
		for (const rulePath of taskConfig.jobs.rules) {
			const rulePrompt = await collectRulePromptOnly(rulePath, useEnhanced);
			if (rulePrompt) {
				yamlObject.jobs.rules.push(rulePrompt);
			}
		}
	}

	// Collect and add MCPs prompts
	if (taskConfig.jobs.mcps && taskConfig.jobs.mcps.length > 0) {
		yamlObject.jobs.mcps = [];
		for (const mcpPath of taskConfig.jobs.mcps) {
			const mcpPrompt = await collectMcpPromptOnly(mcpPath, useEnhanced);
			if (mcpPrompt) {
				yamlObject.jobs.mcps.push(mcpPrompt);
			}
		}
	}

	// Add systemprompt
	if (taskConfig.systemprompt) {
		yamlObject.systemprompt = taskConfig.systemprompt;
	}

	// Add prompt (use enhanced if available and requested)
	if (useEnhanced && taskConfig.enhancedprompt) {
		yamlObject.prompt = taskConfig.enhancedprompt;
	} else {
		yamlObject.prompt = taskConfig.prompt;
	}

	return yamlObject;
}
