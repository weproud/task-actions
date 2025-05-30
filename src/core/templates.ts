import * as path from 'path';
import { FileSystemUtils, TemplateType } from '../generator';

export interface ListTemplatesOptions {
	type?: string;
}

/**
 * Query available template list
 */
export async function listTemplates(
	options?: ListTemplatesOptions
): Promise<void> {
	console.log('📋 Available template list:\n');

	const templateDir = path.join(__dirname, '../templates');

	if (!FileSystemUtils.fileExists(templateDir)) {
		console.log('❌ Template directory not found.');
		return;
	}

	const templateTypes: TemplateType[] = ['action', 'workflow', 'mcp', 'rule'];

	if (options?.type) {
		// Query specific type only
		const requestedType = options.type as TemplateType;
		if (templateTypes.includes(requestedType)) {
			await listTemplatesByType(requestedType, templateDir);
		} else {
			console.log(`❌ Unknown template type: ${options.type}`);
			console.log(`Available types: ${templateTypes.join(', ')}`);
		}
	} else {
		// Query all types
		for (const type of templateTypes) {
			await listTemplatesByType(type, templateDir);
		}
	}
}

/**
 * Query templates of specific type
 */
async function listTemplatesByType(
	type: TemplateType,
	templateDir: string
): Promise<void> {
	console.log(`📂 ${type.toUpperCase()} Templates:`);

	const typeDir = path.join(templateDir, type);

	if (!FileSystemUtils.fileExists(typeDir)) {
		console.log(`   ❌ ${type} template directory does not exist.`);
		return;
	}

	try {
		const templates = FileSystemUtils.listFiles(typeDir, '.yaml');

		if (templates.length === 0) {
			console.log('   📄 No available templates.');
		} else {
			templates.forEach((template) => {
				const templateName = path.basename(template, '.yaml');
				console.log(`   📄 ${templateName}`);
			});
		}
	} catch (error) {
		console.log(`   ❌ Error occurred while reading template list: ${error}`);
	}

	console.log(''); // Add empty line
}
