# Task Actions CLI

A CLI tool for task automation systems similar to GitHub Actions.

## ✨ Recent Updates (Refactoring)

### 🔧 Major Improvements

#### 1. **Code Deduplication and Reusability Enhancement**

- Unified repetitive template generation patterns into `TemplateProcessor` class
- Centralized template configuration management with `template-config.ts`
- Separated file system operations into `FileSystemUtils` for improved reusability

#### 2. **Code Simplification**

- Split complex methods in `YamlGenerator` class into smaller, more understandable units
- Unified duplicate `generate*` methods with common logic
- Extracted error handling and validation logic into separate methods

#### 3. **Structural Improvements**

- Logically grouped related functionalities:
  - `FileSystemUtils`: File system operations
  - `TemplateProcessor`: Template processing logic
  - `TemplateEngine`: Enhanced template engine features
  - `template-config.ts`: Centralized template configuration
- Enhanced type safety and interface improvements
- Comprehensive error handling and validation logic

#### 4. **Performance Optimization**

- Minimized unnecessary file system access
- Optimized memory usage
- Improved efficiency through batch processing

### 🏗️ New Architecture

```
src/generator/
├── index.ts              # Main YamlGenerator class
├── types.ts              # Enhanced type definitions
├── template-config.ts    # Centralized template configuration
├── template-processor.ts # Template processing logic
├── template-engine.ts    # Enhanced template engine
└── file-system-utils.ts  # File system utilities
```

### 📊 Refactoring Results

- **Code Deduplication**: 90% reduction in similar patterns across `generate*` methods
- **Improved Maintainability**: Enhanced code comprehension and modification ease through separation of concerns
- **Better Extensibility**: Adding new template types now requires only configuration file modifications
- **Enhanced Error Handling**: Comprehensive validation and detailed error messages
- **Type Safety**: Strengthened TypeScript types to prevent runtime errors

---

## 🚀 Features

Generate and manage GitHub Actions-style workflows, actions, rules, and more for your projects.

### Supported Template Types

- **Actions**: Individual task units
- **Workflows**: Combinations of actions
- **MCPs**: Model Context Protocol
- **Rules**: Development rules
- **Tasks**: Project tasks

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g task-actions-ai
```

After installation, you can use the `task-actions` command anywhere:

```bash
task-actions --help
```

### Local Development Installation

To develop or test the project locally:

```bash
# Clone repository
git clone https://github.com/raiiz/task-actions.git
cd task-actions

# Install dependencies
npm install

# Build
npm run build

# Local link (for development)
npm link

# Now you can use task-actions command
task-actions --help
```

## 🤖 MCP 서버 (AI 어시스턴트 연동) - FastMCP 기반

Task Actions CLI를 Claude Desktop과 같은 AI 어시스턴트와 연동하여 사용할 수 있는 **FastMCP 기반** Model Context Protocol (MCP) 서버를 제공합니다.

### ✨ **FastMCP 2.0 업그레이드**

- **기존**: `@modelcontextprotocol/sdk` 기반
- **새로운**: `fastmcp` 기반 (TypeScript 프레임워크)
- **개선사항**:
  - Zod 스키마를 통한 자동 타입 안전성
  - 더 간단한 도구 정의와 적은 보일러플레이트
  - 내장 이벤트 시스템
  - 향상된 개발자 경험 (`fastmcp dev`, `fastmcp inspect`)

### 🔧 MCP 서버 설치

```bash
cd mcp-server
./install.sh
```

설치 스크립트가 자동으로:

1. 부모 프로젝트와 MCP 서버를 빌드
2. FastMCP 의존성 설치
3. Claude Desktop 설정 파일 예제를 생성
4. 설정 방법을 안내

### ⚡ 빠른 설정 (Claude Desktop)

1. **Claude Desktop 종료**
2. **설정 파일 편집** (macOS):

   ```bash
   # 설정 파일 열기
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   다음 내용 추가:

   ```json
   {
   	"mcpServers": {
   		"task-actions-local": {
   			"command": "node",
   			"args": [
   				"/Users/raiiz/labs/workspace/task-actions/mcp-server/dist/index.js"
   			],
   			"env": {},
   			"description": "Task Actions AI - 로컬 개발용 MCP 서버"
   		}
   	}
   }
   ```

3. **Claude Desktop 재시작**

### 🧪 개발 및 테스트

FastMCP의 강력한 개발 도구를 활용하세요:

```bash
cd mcp-server

# 대화형 개발 서버
npm run dev

# 웹 인터페이스로 테스트
npm run inspect

# 일반 실행
npm start
```

### 🎯 AI 어시스턴트에서 사용 예시

Claude Desktop에서 다음과 같이 대화할 수 있습니다:

```
사용자: "새로운 task-actions 프로젝트를 초기화해 주세요."
Claude: init_project 도구를 사용하여 프로젝트를 초기화하겠습니다.

사용자: "action 템플릿을 생성해 주세요."
Claude: add_action 도구를 사용하여 액션 파일들을 생성하겠습니다.

사용자: "user-auth라는 태스크를 만들어주세요."
Claude: add_task 도구를 사용하여 사용자 인증 태스크를 생성하겠습니다.
```

### 🔍 제공되는 MCP Tools

| Tool               | 설명                 | 매개변수                              |
| ------------------ | -------------------- | ------------------------------------- |
| `init_project`     | 프로젝트 초기화      | 없음                                  |
| `add_action`       | Action 템플릿 생성   | 없음                                  |
| `add_workflow`     | Workflow 템플릿 생성 | 없음                                  |
| `add_mcp`          | MCP 템플릿 생성      | 없음                                  |
| `add_rule`         | Rule 템플릿 생성     | 없음                                  |
| `add_task`         | 새 태스크 생성       | `taskId`, `taskName?`, `description?` |
| `list_templates`   | 템플릿 목록 조회     | `type?`                               |
| `check_status`     | 프로젝트 상태 확인   | `detailed?`                           |
| `validate_project` | 프로젝트 검증        | 없음                                  |
| `clean_project`    | 프로젝트 정리        | `force?`                              |
| `start_task`       | 태스크 시작          | `taskId`, `output?`, `clipboard?`     |

자세한 MCP 서버 설정 및 사용법은 [`mcp-server/README.md`](./mcp-server/README.md)를 참조하세요.

## 🔧 사용법

### 프로젝트 초기화

```bash
task-actions init
```

### 특정 타입 생성

```bash
# 액션 파일들만 생성
task-actions generate action

# 워크플로우 파일들만 생성
task-actions generate workflow

# MCP 파일들만 생성
task-actions generate mcp
```

### 새로운 태스크 생성

```bash
task-actions add task "새로운 기능 개발" "사용자 인증 기능을 구현합니다"
```

### 태스크 시작 및 개발용 Prompt 생성

```bash
# 기본 YAML 구조 출력
task-actions start task <task-id>

# YAML 구조를 파일로 저장
task-actions start task <task-id> --output task-structure.yaml

# YAML 구조를 클립보드에 복사 (macOS만 지원)
task-actions start task <task-id> --clipboard

# 파일 저장과 클립보드 복사 동시 실행
task-actions start task <task-id> --output task-structure.yaml --clipboard
```

이 명령어는 task-jwt-provider.yaml 파일을 읽어서 Task YAML 구조와 동일한 형태로 출력하되, 참조되는 파일들(workflow, rules, mcps)의 순수한 prompt 내용만 표시합니다:

- Task의 기본 정보와 요구사항
- Workflow의 각 단계별 prompt (헤더 없는 순수 내용)
- Rules에 정의된 개발 규칙 (헤더 없는 순수 내용)
- MCPs의 활용 가이드 (헤더 없는 순수 내용)

#### Task 구조 조회

```bash
# Task YAML 구조 형태로 prompt 조회
task-actions show task <task-id>
```

이 명령어는 Task YAML 파일과 동일한 구조로 출력하되, 참조 파일들의 순수한 prompt 내용만 표시합니다.

### 태스크 완료 및 알림 전송

```bash
# 태스크를 완료로 표시하고 Slack, Discord 알림 전송
task-actions done <task-id>

# Slack 알림 없이 태스크만 완료 처리
task-actions done <task-id> --skip-slack

# Discord 알림 없이 태스크만 완료 처리
task-actions done <task-id> --skip-discord

# 모든 알림 없이 태스크만 완료 처리
task-actions done <task-id> --skip-slack --skip-discord

# 이미 완료된 태스크를 강제로 다시 완료 처리
task-actions done <task-id> --force
```

태스크 완료 시 자동으로:

- 태스크 상태를 'done'으로 변경
- tasks.yaml 파일 업데이트
- SLACK_WEBHOOK_URL이 설정되어 있으면 Slack으로 완료 알림 전송
- DISCORD_WEBHOOK_URL이 설정되어 있으면 Discord로 완료 알림 전송

### Slack 및 Discord 연동 설정

#### 1. 환경변수 설정

MCP 서버 설정에서 환경변수를 추가하세요:

**Claude Desktop 설정 (claude_desktop_config.json):**

```json
{
	"mcpServers": {
		"task-actions": {
			"command": "npx",
			"args": ["-y", "@modelcontextprotocol/task-actions"],
			"env": {
				"SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
				"DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK"
			},
			"description": "Task Actions AI - GitHub Actions 스타일의 개발 워크플로우를 관리하는 MCP 서버"
		}
	}
}
```

#### 2. Slack Webhook URL 생성

1. [Slack API](https://api.slack.com/apps)에서 새 앱 생성
2. "Incoming Webhooks" 기능 활성화
3. 채널을 선택하고 Webhook URL 생성
4. 생성된 URL을 `SLACK_WEBHOOK_URL` 환경변수에 설정

#### 3. Discord Webhook URL 생성

1. Discord 서버에서 알림을 받을 채널을 선택
2. 채널 설정 → 연동 → 웹후크 → 새 웹후크 생성
3. 웹후크 이름과 아바타 설정 (선택사항)
4. "웹후크 URL 복사"를 클릭하여 URL 획득
5. 생성된 URL을 `DISCORD_WEBHOOK_URL` 환경변수에 설정

#### 4. 메시지 전송 예시

프로그래밍 방식으로 알림을 보낼 수도 있습니다:

```typescript
import {
	sendSlackMessage,
	sendDiscordMessage,
	notifyTaskCompletion,
	notifyTaskCompletionDiscord
} from 'task-actions';

// Slack 메시지
await sendSlackMessage('Hello, Slack!');

// Discord 메시지
await sendDiscordMessage('Hello, Discord!');

// 풍부한 형식의 Slack 메시지
await sendSlackMessage({
	text: '새로운 알림입니다!',
	username: 'Task Bot',
	icon_emoji: ':robot_face:',
	attachments: [
		{
			color: 'good',
			title: '작업 완료',
			fields: [
				{
					title: '프로젝트',
					value: 'My Project',
					short: true
				}
			]
		}
	]
});

// 풍부한 형식의 Discord 메시지
await sendDiscordMessage({
	content: '새로운 알림입니다!',
	username: 'Task Bot',
	embeds: [
		{
			color: 0x00ff00,
			title: '작업 완료',
			fields: [
				{
					name: '프로젝트',
					value: 'My Project',
					inline: true
				}
			]
		}
	]
});

// 태스크 완료 알림
await notifyTaskCompletion('TASK-001', '사용자 인증 구현', 'My Project');
await notifyTaskCompletionDiscord('TASK-001', '사용자 인증 구현', 'My Project');
```

### 사용 가능한 템플릿 목록 조회

```bash
task-actions list
```

## 🎯 예제

### 기본 프로젝트 구조 생성

```bash
task-actions init --project-name "my-project" --author "개발자명"
```

이 명령어는 다음 구조를 생성합니다:

```
.task-actions/
├── actions/
│   ├── create-branch.yaml
│   ├── development.yaml
│   ├── git-commit.yaml
│   ├── git-push.yaml
│   ├── create-pull-request.yaml
│   └── task-done.yaml
├── workflows/
│   └── feature-development.yaml
├── mcps/
│   ├── context7.yaml
│   ├── playwright.yaml
│   └── sequential-thinking.yaml
├── rules/
│   └── development-rule.yaml
├── tasks.yaml
└── vars.yaml
```

### 프로그래밍 방식 사용

```typescript
import {
	YamlGenerator,
	FileSystemUtils,
	TemplateProcessor
} from 'task-actions';

const generator = new YamlGenerator({
	outputDir: './my-project',
	templateDir: './templates',
	variables: {
		projectName: 'My Project',
		projectDescription: 'A sample project',
		author: 'Developer Name',
		version: '1.0.0'
	},
	overwrite: false
});

// 모든 파일 생성
const stats = await generator.generateAll();

// 특정 타입만 생성
await generator.generateByType('action');

// 새로운 태스크 생성
await generator.generateTask('001', 'Setup', 'Initial project setup');
```

## 🔗 구성 파일

### vars.yaml

프로젝트 전역 변수를 정의합니다.

```yaml
slack_webhook_url: 'https://hooks.slack.com/...'
discord_webhook_url: 'https://discord.com/api/webhooks/...'
github_token: '${GITHUB_TOKEN}'
```

### tasks.yaml

프로젝트의 태스크 목록을 관리합니다.

```yaml
version: 1
name: 'Project Tasks'
description: 'Main task list for the project'
tasks:
  - id: '001'
    status: 'todo'
  - id: '002'
    status: 'in-progress'
```

## 🛠️ 개발

### 로컬 개발 환경 설정

```bash
git clone <repository-url>
cd task-actions
npm install
npm run build
```

### 테스트 실행

```bash
npm test
```

### 빌드

```bash
npm run build
```

## 📝 라이선스

MIT License

## 🤝 기여

기여를 환영합니다! 이슈를 제기하거나 풀 리퀘스트를 보내주세요.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해주세요.
