import * as path from 'path';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { FileSystemUtils, TASK_ACTIONS_DIR } from '../generator';
import { ValidationResult } from './types';

// Interface definitions for file types to validate
interface BaseYamlConfig {
	version: number;
	kind: string;
	name: string;
	description: string;
	prompt: string;
}

interface TaskConfig extends BaseYamlConfig {
	id: string;
	status: string;
	jobs: {
		workflow?: string;
		rules?: string[];
		mcps?: string[];
		// Allow dynamically added custom jobs
		[key: string]: string | string[] | undefined;
	};
}

interface WorkflowConfig extends BaseYamlConfig {
	jobs: {
		steps: Array<{
			name: string;
			uses?: string;
			prompt?: string;
		}>;
	};
}

// Known job types and their corresponding validation functions
const KNOWN_JOB_TYPES = {
	workflow: 'validateWorkflowRecursively',
	rules: 'validateRuleFile',
	mcps: 'validateMcpFile'
} as const;

/**
 * Type guard for WorkflowConfig
 */
function isWorkflowConfig(config: any): config is WorkflowConfig {
	return (
		config &&
		typeof config === 'object' &&
		'jobs' in config &&
		config.jobs &&
		typeof config.jobs === 'object' &&
		'steps' in config.jobs &&
		Array.isArray(config.jobs.steps)
	);
}

/**
 * Type guard for TaskConfig
 */
function isTaskConfig(config: any): config is TaskConfig {
	return (
		config &&
		typeof config === 'object' &&
		'jobs' in config &&
		config.jobs &&
		typeof config.jobs === 'object'
	);
}

/**
 * Validate required fields in YAML files
 */
function validateRequiredFields(config: any, filePath: string): string[] {
	const requiredFields = ['version', 'kind', 'name', 'description', 'prompt'];
	const errors: string[] = [];

	for (const field of requiredFields) {
		if (
			!config ||
			config[field] === undefined ||
			config[field] === null ||
			config[field] === ''
		) {
			errors.push(`${filePath}: Required field '${field}' is missing.`);
		}
	}

	return errors;
}

/**
 * Read and parse YAML files
 */
async function loadYamlFile(
	filePath: string
): Promise<{ config: any; errors: string[] }> {
	const errors: string[] = [];

	try {
		// Check file existence
		await fs.access(filePath);

		// Read file
		const content = await fs.readFile(filePath, 'utf-8');

		if (content.trim().length === 0) {
			errors.push(`${filePath}: File is empty.`);
			return { config: null, errors };
		}

		// Parse YAML
		const config = yaml.load(content);

		if (!config) {
			errors.push(`${filePath}: YAML parsing failed.`);
			return { config: null, errors };
		}

		return { config, errors };
	} catch (error) {
		if ((error as any).code === 'ENOENT') {
			errors.push(`${filePath}: File does not exist.`);
		} else {
			errors.push(`${filePath}: File read error - ${(error as Error).message}`);
		}
		return { config: null, errors };
	}
}

/**
 * Generic YAML file validation (for custom file types)
 */
async function validateGenericYamlFile(
	filePath: string,
	visitedFiles: Set<string>,
	fileType: string = 'Custom'
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', filePath);

	// Prevent circular references
	if (visitedFiles.has(fullPath)) {
		errors.push(`${filePath}: Circular reference detected.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   📦 Validating ${fileType}: ${filePath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// Validate required fields
	errors.push(...validateRequiredFields(config, filePath));

	return errors;
}

/**
 * Recursively validate workflow files and their referenced uses files
 */
async function validateWorkflowRecursively(
	workflowPath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', workflowPath);

	// Prevent circular references
	if (visitedFiles.has(fullPath)) {
		errors.push(`${workflowPath}: Circular reference detected.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   📄 Validating Workflow: ${workflowPath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// Validate required fields
	errors.push(...validateRequiredFields(config, workflowPath));

	// Validate WorkflowConfig type
	if (!isWorkflowConfig(config)) {
		errors.push(`${workflowPath}: Missing valid jobs.steps array.`);
		return errors;
	}

	// Recursively validate uses files in each step
	for (const step of config.jobs.steps) {
		if (step.uses) {
			const actionErrors = await validateActionFile(step.uses, visitedFiles);
			errors.push(...actionErrors);
		}
		if (step.prompt) {
			const promptErrors = await validateActionFile(step.prompt, visitedFiles);
			errors.push(...promptErrors);
		}
	}

	return errors;
}

/**
 * Validate Action files
 */
async function validateActionFile(
	actionPath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', actionPath);

	// Prevent circular references
	if (visitedFiles.has(fullPath)) {
		errors.push(`${actionPath}: Circular reference detected.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`     🎬 Validating Action: ${actionPath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// Validate required fields
	errors.push(...validateRequiredFields(config, actionPath));

	return errors;
}

/**
 * Validate Rule files
 */
async function validateRuleFile(
	rulePath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', rulePath);

	// Prevent circular references
	if (visitedFiles.has(fullPath)) {
		errors.push(`${rulePath}: Circular reference detected.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   📜 Validating Rule: ${rulePath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// Validate required fields
	errors.push(...validateRequiredFields(config, rulePath));

	return errors;
}

/**
 * Validate MCP files
 */
async function validateMcpFile(
	mcpPath: string,
	visitedFiles: Set<string>
): Promise<string[]> {
	const errors: string[] = [];
	const fullPath = path.join('.task-actions', mcpPath);

	// Prevent circular references
	if (visitedFiles.has(fullPath)) {
		errors.push(`${mcpPath}: Circular reference detected.`);
		return errors;
	}
	visitedFiles.add(fullPath);

	console.log(`   🔧 Validating MCP: ${mcpPath}`);

	const { config, errors: loadErrors } = await loadYamlFile(fullPath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// Validate required fields
	errors.push(...validateRequiredFields(config, mcpPath));

	return errors;
}

/**
 * Generic function to validate file path arrays
 */
async function validateFileArray(
	filePaths: string[],
	visitedFiles: Set<string>,
	validatorFunction: (
		filePath: string,
		visitedFiles: Set<string>
	) => Promise<string[]>
): Promise<string[]> {
	const errors: string[] = [];

	for (const filePath of filePaths) {
		const fileErrors = await validatorFunction(filePath, visitedFiles);
		errors.push(...fileErrors);
	}

	return errors;
}

/**
 * Validate Task files and recursively validate all referenced files (supports custom jobs)
 */
async function validateTaskFile(taskFilePath: string): Promise<string[]> {
	const errors: string[] = [];
	const visitedFiles = new Set<string>();

	console.log(`🎯 Validating Task file: ${taskFilePath}`);

	const { config, errors: loadErrors } = await loadYamlFile(taskFilePath);
	errors.push(...loadErrors);

	if (!config) {
		return errors;
	}

	// Validate required fields
	errors.push(...validateRequiredFields(config, taskFilePath));

	// Validate TaskConfig type
	if (!isTaskConfig(config)) {
		errors.push(`${taskFilePath}: Missing jobs section.`);
		return errors;
	}

	// Validate all jobs entries (both known and custom)
	for (const [jobKey, jobValue] of Object.entries(config.jobs)) {
		if (jobValue === undefined || jobValue === null) {
			continue;
		}

		// Handle known job types with existing logic
		if (jobKey in KNOWN_JOB_TYPES) {
			if (jobKey === 'workflow' && typeof jobValue === 'string') {
				const workflowErrors = await validateWorkflowRecursively(
					jobValue,
					visitedFiles
				);
				errors.push(...workflowErrors);
			} else if (jobKey === 'rules' && Array.isArray(jobValue)) {
				const ruleErrors = await validateFileArray(
					jobValue,
					visitedFiles,
					validateRuleFile
				);
				errors.push(...ruleErrors);
			} else if (jobKey === 'mcps' && Array.isArray(jobValue)) {
				const mcpErrors = await validateFileArray(
					jobValue,
					visitedFiles,
					validateMcpFile
				);
				errors.push(...mcpErrors);
			}
		} else {
			// Handle custom job types with generic validation function
			console.log(`   🔍 Custom job type found: ${jobKey}`);

			if (typeof jobValue === 'string') {
				// Single file reference
				const customErrors = await validateGenericYamlFile(
					jobValue,
					visitedFiles,
					`Custom-${jobKey}`
				);
				errors.push(...customErrors);
			} else if (Array.isArray(jobValue)) {
				// File array reference
				const customErrors = await validateFileArray(
					jobValue,
					visitedFiles,
					(filePath, visited) =>
						validateGenericYamlFile(filePath, visited, `Custom-${jobKey}`)
				);
				errors.push(...customErrors);
			} else {
				errors.push(
					`${taskFilePath}: jobs.${jobKey} must be a string or string array.`
				);
			}
		}
	}

	return errors;
}

/**
 * Validate project
 */
export async function validateProject(): Promise<ValidationResult> {
	console.log('🔍 Starting project validation...\n');

	const currentDir = process.cwd();
	const taskActionsPath = path.join(currentDir, TASK_ACTIONS_DIR);
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check if .task-actions directory exists
	if (!FileSystemUtils.fileExists(taskActionsPath)) {
		errors.push('Task Actions project is not initialized.');
		return { isValid: false, errors, warnings };
	}

	// Check required base files
	const requiredFiles = ['vars.yaml', 'tasks.yaml'];
	const missingFiles = [];

	for (const file of requiredFiles) {
		const filePath = path.join(taskActionsPath, file);
		if (!FileSystemUtils.fileExists(filePath)) {
			missingFiles.push(file);
		}
	}

	if (missingFiles.length > 0) {
		errors.push(`Missing required files: ${missingFiles.join(', ')}`);
	} else {
		console.log('✅ All required base files exist.');
	}

	// Find and validate Task files
	console.log('\n📝 Validating Task files...');

	try {
		const files = await fs.readdir(taskActionsPath);
		const taskFiles = files.filter(
			(file) => file.startsWith('task-') && file.endsWith('.yaml')
		);

		if (taskFiles.length === 0) {
			warnings.push('No Task files found.');
		} else {
			console.log(`Found Task files: ${taskFiles.length}\n`);

			// Recursively validate each Task file
			for (const taskFile of taskFiles) {
				const taskFilePath = path.join(taskActionsPath, taskFile);
				const taskErrors = await validateTaskFile(taskFilePath);
				errors.push(...taskErrors);
			}
		}
	} catch (error) {
		errors.push(`Error reading Task file list: ${(error as Error).message}`);
	}

	const isValid = errors.length === 0;

	console.log('\n' + '='.repeat(50));
	if (isValid) {
		console.log('✅ Project validation completed.');
		if (warnings.length > 0) {
			console.log('\n⚠️  Warnings:');
			warnings.forEach((warning) => console.log(`   - ${warning}`));
		}
	} else {
		console.log('❌ Errors found during project validation:');
		errors.forEach((error) => console.log(`   - ${error}`));

		if (warnings.length > 0) {
			console.log('\n⚠️  Additional warnings:');
			warnings.forEach((warning) => console.log(`   - ${warning}`));
		}
	}
	console.log('='.repeat(50));

	return { isValid, errors, warnings };
}

/**
 * YAML file validation (maintained for backward compatibility)
 */
export async function validateYamlFiles(dirPath: string): Promise<void> {
	const yamlFiles = FileSystemUtils.listFiles(dirPath, '.yaml');

	for (const file of yamlFiles) {
		const filePath = path.join(dirPath, file);
		try {
			const content = FileSystemUtils.readFile(filePath);
			// Simple YAML structure check
			if (content.trim().length === 0) {
				console.log(`   ❌ ${file}: Empty file`);
				// Basic structure generation logic
			} else {
				console.log(`   ✅ ${file}: Valid`);
			}
		} catch (error) {
			console.log(`   ❌ ${file}: Read error - ${error}`);
		}
	}
}
