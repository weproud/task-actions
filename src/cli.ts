#!/usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

const program = new Command();

program
  .name("task-actions")
  .description("Task Actions CLI - 워크플로우 및 태스크 관리 도구")
  .version("1.0.0");

// init 명령어 정의
program
  .command("init")
  .description("새로운 task-actions 프로젝트를 초기화합니다")
  .action(async () => {
    console.log("🚀 Task Actions 프로젝트를 초기화합니다...\n");

    try {
      await initProject();
      console.log("✅ 프로젝트 초기화가 완료되었습니다!");
      console.log("\n다음 단계:");
      console.log("1. assets/tasks.yaml 파일을 편집하여 태스크를 정의하세요");
      console.log("2. assets/workflows/ 디렉토리에서 워크플로우를 설정하세요");
      console.log("3. task-actions 명령어로 태스크를 실행하세요");
    } catch (error) {
      console.error("❌ 초기화 중 오류가 발생했습니다:", error);
      process.exit(1);
    }
  });

async function initProject(): Promise<void> {
  const currentDir = process.cwd();

  // 필요한 디렉토리 구조 생성
  const directories = [
    "assets",
    "assets/actions",
    "assets/mcps",
    "assets/rules",
    "assets/workflows",
  ];

  console.log("📁 디렉토리 구조를 생성합니다...");
  for (const dir of directories) {
    const dirPath = path.join(currentDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`   ✓ ${dir}/`);
    } else {
      console.log(`   - ${dir}/ (이미 존재함)`);
    }
  }

  // 기본 설정 파일들 생성
  const files = [
    {
      path: "assets/tasks.yaml",
      content: getTasksTemplate(),
    },
    {
      path: "assets/vars.yaml",
      content: getVarsTemplate(),
    },
    {
      path: "assets/workflows/example.yaml",
      content: getWorkflowTemplate(),
    },
    {
      path: "assets/actions/example-action.yaml",
      content: getActionTemplate(),
    },
  ];

  console.log("\n📄 기본 설정 파일을 생성합니다...");
  for (const file of files) {
    const filePath = path.join(currentDir, file.path);

    if (fs.existsSync(filePath)) {
      console.log(`   - ${file.path} (이미 존재함)`);
    } else {
      fs.writeFileSync(filePath, file.content, "utf8");
      console.log(`   ✓ ${file.path}`);
    }
  }
}

function getTasksTemplate(): string {
  return `# Task Actions 설정 파일
# 이 파일에서 사용 가능한 태스크들을 정의합니다

tasks:
  - id: "example-task"
    name: "예제 태스크"
    description: "Task Actions 사용법을 보여주는 예제 태스크입니다"
    workflow: "example"
    variables:
      task_name: "예제 태스크"
      priority: "medium"

  - id: "development-task"
    name: "개발 태스크"
    description: "개발 관련 작업을 수행하는 태스크입니다"
    workflow: "development"
    variables:
      environment: "development"
      auto_deploy: false
`;
}

function getVarsTemplate(): string {
  return `# 전역 변수 설정
# 모든 태스크와 워크플로우에서 사용할 수 있는 변수들을 정의합니다

global:
  project_name: "my-project"
  version: "1.0.0"
  author: "개발자"

environment:
  development:
    debug: true
    log_level: "debug"

  production:
    debug: false
    log_level: "info"
`;
}

function getWorkflowTemplate(): string {
  return `# 예제 워크플로우
# 이 파일은 태스크 실행 시 수행될 단계들을 정의합니다

name: "example"
description: "예제 워크플로우입니다"

steps:
  - name: "초기화"
    action: "example-action"
    variables:
      step_name: "초기화 단계"

  - name: "작업 수행"
    action: "example-action"
    variables:
      step_name: "작업 수행 단계"

  - name: "완료"
    action: "example-action"
    variables:
      step_name: "완료 단계"
`;
}

function getActionTemplate(): string {
  return `# 예제 액션
# 이 파일은 워크플로우 단계에서 실행될 구체적인 작업을 정의합니다

name: "example-action"
description: "예제 액션입니다"

parameters:
  - name: "step_name"
    type: "string"
    required: true
    description: "단계 이름"

execution:
  type: "script"
  script: |
    echo "🔄 \${step_name} 실행 중..."
    echo "✅ \${step_name} 완료!"
`;
}

// 프로그램 실행
program.parse();
