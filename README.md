# Task Actions CLI

GitHub Actions와 유사한 태스크 자동화 시스템을 위한 CLI 도구입니다.

## ✨ 최근 업데이트 (리팩토링)

### 🔧 주요 개선사항

#### 1. **중복 코드 제거 및 재사용성 개선**

- 반복되는 템플릿 생성 패턴을 `TemplateProcessor` 클래스로 통합
- 템플릿 설정을 `template-config.ts`로 중앙화하여 관리
- 파일 시스템 작업을 `FileSystemUtils`로 분리하여 재사용성 향상

#### 2. **코드 단순화 (Simplification)**

- `YamlGenerator` 클래스의 복잡한 메서드들을 더 작고 이해하기 쉬운 단위로 분리
- 중복된 `generate*` 메서드들을 공통 로직으로 통합
- 에러 처리와 검증 로직을 별도 메서드로 추출

#### 3. **구조적 개선**

- 관련 기능들을 논리적으로 그룹화:
  - `FileSystemUtils`: 파일 시스템 작업
  - `TemplateProcessor`: 템플릿 처리 로직
  - `TemplateEngine`: 템플릿 엔진 기능 강화
  - `template-config.ts`: 템플릿 설정 중앙화
- 강력한 타입 안전성과 인터페이스 개선
- 포괄적인 에러 처리 및 검증 로직

#### 4. **성능 최적화**

- 불필요한 파일 시스템 접근 최소화
- 메모리 사용량 최적화
- 배치 처리를 통한 효율성 향상

### 🏗️ 새로운 아키텍처

```
src/generator/
├── index.ts              # 메인 YamlGenerator 클래스
├── types.ts              # 강화된 타입 정의
├── template-config.ts    # 중앙화된 템플릿 설정
├── template-processor.ts # 템플릿 처리 로직
├── template-engine.ts    # 향상된 템플릿 엔진
└── file-system-utils.ts  # 파일 시스템 유틸리티
```

### 📊 리팩토링 효과

- **코드 중복 제거**: 각 `generate*` 메서드의 유사한 패턴 90% 감소
- **유지보수성 향상**: 관심사 분리로 코드 이해도 및 수정 용이성 증대
- **확장성 개선**: 새로운 템플릿 타입 추가가 설정 파일 수정만으로 가능
- **에러 처리 강화**: 포괄적인 검증 및 상세한 에러 메시지 제공
- **타입 안전성**: 강화된 TypeScript 타입으로 런타임 오류 방지

---

## 🚀 기능

프로젝트에 GitHub Actions 스타일의 워크플로우, 액션, 규칙 등을 생성하고 관리할 수 있습니다.

### 지원하는 템플릿 타입

- **Actions**: 개별 작업 단위
- **Workflows**: 액션들의 조합
- **MCPs**: 모델 컨텍스트 프로토콜
- **Rules**: 개발 규칙
- **Tasks**: 프로젝트 작업

## 📦 설치

### Global 설치 (권장)

```bash
npm install -g task-actions-ai
```

설치 후 어디서든 `task-actions` 명령어를 사용할 수 있습니다:

```bash
task-actions --help
```

### 로컬 개발용 설치

프로젝트를 로컬에서 개발하거나 테스트하려면:

```bash
# 저장소 클론
git clone https://github.com/raiiz/task-actions.git
cd task-actions

# 의존성 설치
npm install

# 빌드
npm run build

# 로컬 링크 (개발용)
npm link

# 이제 task-actions 명령어 사용 가능
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
   		"task-actions": {
   			"command": "node",
   			"args": ["/your/path/to/task-actions/mcp-server/dist/index.js"],
   			"env": {},
   			"description": "Task Actions CLI를 위한 FastMCP 기반 MCP 서버"
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
# 기본 prompt 출력
task-actions start task <task-id>

# Prompt를 파일로 저장
task-actions start task <task-id> --output prompt.md

# Prompt를 클립보드에 복사 (macOS만 지원)
task-actions start task <task-id> --clipboard

# 파일 저장과 클립보드 복사 동시 실행
task-actions start task <task-id> --output prompt.md --clipboard
```

이 명령어는 task-jwt-provider.yaml 파일을 읽어서:

- Task의 기본 정보와 요구사항
- Workflow의 각 단계별 prompt (uses 파일들을 재귀적으로 수집)
- Rules에 정의된 개발 규칙
- MCPs의 활용 가이드

를 통합하여 개발용 통합 Prompt를 생성합니다.

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
