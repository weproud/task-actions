#!/usr/bin/env node

import { Command } from 'commander';
import { TemplateType } from './generator';
import {
	initProject,
	generateByType,
	generateTask,
	checkProjectStatus,
	validateProject,
	cleanProject,
	printNextSteps,
	listTemplates
} from './core';

const program = new Command();

// 전역 옵션
let debugMode = false;

program
	.name('task-actions')
	.description('Task Actions CLI - 워크플로우 및 태스크 관리 도구')
	.version('1.0.0')
	.option('--debug', '디버그 모드 활성화')
	.hook('preAction', (thisCommand) => {
		debugMode = thisCommand.opts().debug || false;

		if (debugMode) {
			console.log('🐛 디버그 모드가 활성화되었습니다.');
		}
	});

// init 명령어 정의
program
	.command('init')
	.description('새로운 task-actions 프로젝트를 초기화합니다')
	.action(async () => {
		console.log('🚀 Task Actions 프로젝트를 초기화합니다...\n');

		try {
			await initProject();
			console.log('✅ 프로젝트 초기화가 완료되었습니다!');
			printNextSteps();
		} catch (error) {
			console.error('❌ 초기화 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// generate 명령어 그룹
const addCmd = program
	.command('add')
	.description('템플릿을 사용하여 새로운 파일을 생성합니다');

// 각 타입별 generate 명령어 추가
const templateTypes: TemplateType[] = ['action', 'workflow', 'mcp', 'rule'];

templateTypes.forEach((type) => {
	addCmd
		.command(type)
		.description(`${type} 파일들을 생성합니다`)
		.action(async () => {
			try {
				await generateByType(type);
			} catch (error) {
				console.error(`❌ ${type} 생성 중 오류가 발생했습니다:`, error);
				if (debugMode) {
					console.error('🐛 스택 트레이스:', error);
				}
				process.exit(1);
			}
		});
});

// task 생성 명령어
addCmd
	.command('task')
	.description('새로운 태스크 파일을 생성합니다')
	.argument('<task-id>', '태스크 ID')
	.argument('[task-name]', '태스크 이름')
	.option('--description <desc>', '태스크 설명')
	.action(async (taskId, taskName, options) => {
		try {
			await generateTask(taskId, taskName, options);
		} catch (error) {
			console.error('❌ 태스크 생성 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// list 명령어
program
	.command('list')
	.alias('ls')
	.description('사용 가능한 템플릿 목록을 조회합니다')
	.option('--type <type>', '특정 타입만 조회')
	.action(async (options) => {
		try {
			await listTemplates(options);
		} catch (error) {
			console.error('❌ 템플릿 목록 조회 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// status 명령어
program
	.command('status')
	.description('프로젝트 상태를 확인합니다')
	.option('--detailed', '상세한 정보 표시')
	.action(async (options) => {
		try {
			await checkProjectStatus(options);
		} catch (error) {
			console.error('❌ 상태 확인 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// validate 명령어
program
	.command('validate')
	.description('생성된 파일들의 유효성을 검사합니다')
	.action(async () => {
		try {
			await validateProject();
		} catch (error) {
			console.error('❌ 검증 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// clean 명령어
program
	.command('clean')
	.description('생성된 파일들을 정리합니다')
	.option('--force', '확인 없이 강제 삭제')
	.action(async (options) => {
		try {
			await cleanProject(options);
		} catch (error) {
			console.error('❌ 정리 중 오류가 발생했습니다:', error);
			if (debugMode) {
				console.error('🐛 스택 트레이스:', error);
			}
			process.exit(1);
		}
	});

// 프로그램 실행
program.parse();
