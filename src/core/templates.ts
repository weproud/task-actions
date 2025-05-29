import * as path from 'path';
import { FileSystemUtils, TemplateType } from '../generator';

export interface ListTemplatesOptions {
	type?: string;
}

/**
 * 사용 가능한 템플릿 목록 조회
 */
export async function listTemplates(
	options?: ListTemplatesOptions
): Promise<void> {
	console.log('📋 사용 가능한 템플릿 목록:\n');

	const templateDir = path.join(__dirname, '../templates');

	if (!FileSystemUtils.fileExists(templateDir)) {
		console.log('❌ 템플릿 디렉토리를 찾을 수 없습니다.');
		return;
	}

	const templateTypes: TemplateType[] = ['action', 'workflow', 'mcp', 'rule'];

	if (options?.type) {
		// 특정 타입만 조회
		const requestedType = options.type as TemplateType;
		if (templateTypes.includes(requestedType)) {
			await listTemplatesByType(requestedType, templateDir);
		} else {
			console.log(`❌ 알 수 없는 템플릿 타입: ${options.type}`);
			console.log(`사용 가능한 타입: ${templateTypes.join(', ')}`);
		}
	} else {
		// 모든 타입 조회
		for (const type of templateTypes) {
			await listTemplatesByType(type, templateDir);
		}
	}
}

/**
 * 특정 타입의 템플릿들 조회
 */
async function listTemplatesByType(
	type: TemplateType,
	templateDir: string
): Promise<void> {
	console.log(`📂 ${type.toUpperCase()} 템플릿:`);

	const typeDir = path.join(templateDir, type);

	if (!FileSystemUtils.fileExists(typeDir)) {
		console.log(`   ❌ ${type} 템플릿 디렉토리가 없습니다.`);
		return;
	}

	try {
		const templates = FileSystemUtils.listFiles(typeDir, '.yaml');

		if (templates.length === 0) {
			console.log('   📄 사용 가능한 템플릿이 없습니다.');
		} else {
			templates.forEach((template) => {
				const templateName = path.basename(template, '.yaml');
				console.log(`   📄 ${templateName}`);
			});
		}
	} catch (error) {
		console.log(`   ❌ 템플릿 목록을 읽는 중 오류가 발생했습니다: ${error}`);
	}

	console.log(''); // 빈 줄 추가
}
