#!/usr/bin/env node

import { Command } from 'commander';
import { MESSAGES } from './core/constants.js';
import { ErrorHandler } from './core/error-handler.js';
import {
	checkProjectStatus,
	cleanProject,
	completeTask,
	generateByType,
	generateTask,
	initProject,
	listTemplates,
	printNextSteps,
	showTask,
	startTask,
	validateProject
} from './core/index.js';
import { TemplateType } from './generator/index.js';

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
		console.log(MESSAGES.INIT.STARTING);

		try {
			await initProject();
			console.log(MESSAGES.INIT.SUCCESS);
			printNextSteps();
		} catch (error) {
			ErrorHandler.handleCliError('초기화', error, debugMode);
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
				ErrorHandler.handleCliError(`${type} 생성`, error, debugMode);
			}
		});
});

// task 생성 명령어
addCmd
	.command('task')
	.description('새로운 태스크 파일을 생성합니다')
	.argument('<task-id>', '태스크 ID')
	.argument('[task-name]', '태스크 이름')
	.action(async (taskId, taskName) => {
		try {
			await generateTask(taskId, taskName);
		} catch (error) {
			ErrorHandler.handleCliError('태스크 생성', error, debugMode);
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
			ErrorHandler.handleCliError('템플릿 목록 조회', error, debugMode);
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
			ErrorHandler.handleCliError('상태 확인', error, debugMode);
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
			ErrorHandler.handleCliError('검증', error, debugMode);
		}
	});

// clean 명령어
program
	.command('clean')
	.description('생성된 파일들을 정리합니다')
	.action(async () => {
		try {
			await cleanProject();
		} catch (error) {
			ErrorHandler.handleCliError('정리', error, debugMode);
		}
	});

// show 명령어 그룹
const showCmd = program
	.command('show')
	.description('태스크와 템플릿 정보를 조회합니다');

// show task 명령어
showCmd
	.command('task')
	.description('지정된 task ID의 템플릿 구성을 확인합니다')
	.argument('<task-id>', '확인할 태스크 ID')
	.option('--enhanced', 'Enhanced prompt를 사용합니다')
	.option('--basic', '기본 prompt를 사용합니다 (vars.yaml 설정 무시)')
	.action(async (taskId, options) => {
		try {
			let enhanced: boolean | undefined;
			if (options.enhanced) {
				enhanced = true;
			} else if (options.basic) {
				enhanced = false;
			}
			// enhanced가 undefined이면 vars.yaml 설정을 사용
			await showTask(taskId, enhanced);
		} catch (error) {
			ErrorHandler.handleCliError('태스크 정보 조회', error, debugMode);
		}
	});

// start 명령어 그룹
const startCmd = program
	.command('start')
	.description('태스크를 시작하고 개발용 prompt를 생성합니다');

// start task 명령어
startCmd
	.command('task')
	.description('지정된 task ID의 태스크를 시작합니다')
	.argument('<task-id>', '시작할 태스크 ID')
	.option('--enhanced', 'Enhanced prompt를 사용합니다')
	.option('--basic', '기본 prompt를 사용합니다 (vars.yaml 설정 무시)')
	.action(async (taskId, options) => {
		try {
			let enhanced: boolean | undefined;
			if (options.enhanced) {
				enhanced = true;
			} else if (options.basic) {
				enhanced = false;
			}
			// enhanced가 undefined이면 vars.yaml 설정을 사용
			await startTask(taskId, enhanced);
		} catch (error) {
			ErrorHandler.handleCliError('태스크 시작', error, debugMode);
		}
	});

// done 명령어
program
	.command('done')
	.description('태스크를 완료로 표시합니다')
	.argument('<task-id>', '완료할 태스크 ID')
	.action(async (taskId) => {
		try {
			await completeTask(taskId);
		} catch (error) {
			ErrorHandler.handleCliError('태스크 완료', error, debugMode);
		}
	});

// 프로그램 실행
program.parse();
