# Task Actions MCP Server

이 프로젝트는 Task Actions CLI 명령어들을 Model Context Protocol (MCP) tools로 제공하는 서버입니다.

## 개요

Task Actions MCP Server는 기존 CLI 명령어들을 AI 어시스턴트가 직접 사용할 수 있는 MCP tools로 변환합니다. 이를 통해 AI가 프로젝트 초기화, 템플릿 생성, 상태 확인 등의 작업을 자동으로 수행할 수 있습니다.

## 제공되는 Tools

### 프로젝트 관리

- `init_project`: 새로운 task-actions 프로젝트 초기화
- `check_status`: 프로젝트 상태 확인
- `validate_project`: 생성된 파일들의 유효성 검사
- `clean_project`: 생성된 파일들 정리

### 템플릿 생성

- `add_action`: action 파일들 생성
- `add_workflow`: workflow 파일들 생성
- `add_mcp`: mcp 파일들 생성
- `add_rule`: rule 파일들 생성
- `add_task`: 새로운 태스크 파일 생성

### 정보 조회

- `list_templates`: 사용 가능한 템플릿 목록 조회

### 태스크 관리

- `start_task`: 지정된 태스크 시작 및 개발용 prompt 생성

## 설치 및 설정

### 1. 의존성 설치

```bash
cd mcp-server
npm install
```

### 2. 빌드

```bash
npm run build
```

### 3. 부모 프로젝트 빌드

MCP 서버가 Task Actions CLI를 호출하므로, 먼저 부모 프로젝트를 빌드해야 합니다:

```bash
cd ..
npm run build
```

## MCP 클라이언트 설정

### Claude Desktop과 연동

Claude Desktop에서 이 MCP 서버를 사용하려면 설정 파일을 수정해야 합니다.

#### macOS

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일에 다음을 추가:

```json
{
	"mcpServers": {
		"task-actions": {
			"command": "node",
			"args": ["/path/to/your/workspace/task-actions/mcp-server/dist/index.js"],
			"env": {}
		}
	}
}
```

#### Windows

`%APPDATA%\Claude\claude_desktop_config.json` 파일에 동일한 설정을 추가합니다.

### 경로 설정 주의사항

위 설정에서 `/path/to/your/workspace/task-actions`를 실제 프로젝트 경로로 변경해야 합니다.

## 사용 예시

Claude Desktop에서 다음과 같이 명령할 수 있습니다:

### 프로젝트 초기화

```
새로운 task-actions 프로젝트를 초기화해 주세요.
```

### 템플릿 생성

```
action 템플릿을 생성해 주세요.
```

### 태스크 생성

```
"user-authentication"이라는 ID로 "사용자 인증 구현"이라는 이름의 태스크를 생성해 주세요.
```

### 프로젝트 상태 확인

```
현재 프로젝트 상태를 상세히 확인해 주세요.
```

### 템플릿 목록 조회

```
사용 가능한 템플릿 목록을 보여주세요.
```

## 개발

### 개발 모드 실행

```bash
npm run dev
```

### 디버깅

MCP 서버가 제대로 작동하지 않는 경우:

1. 부모 프로젝트가 빌드되었는지 확인
2. Claude Desktop 설정 파일의 경로가 올바른지 확인
3. Node.js 권한 확인
4. Claude Desktop 재시작

### 로그 확인

MCP 서버의 로그는 `console.error`를 통해 stderr로 출력됩니다. Claude Desktop의 개발자 도구에서 확인할 수 있습니다.

## 기술 스택

- **TypeScript**: 타입 안전성
- **@modelcontextprotocol/sdk**: MCP 프로토콜 구현
- **Node.js**: 런타임 환경
- **Child Process**: CLI 명령어 실행

## 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Assistant  │    │   MCP Server    │    │ Task Actions    │
│   (Claude)      │◄──►│   (tools.ts)    │◄──►│     CLI         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

1. AI 어시스턴트가 MCP 서버에 tool 실행 요청
2. MCP 서버가 요청을 받아 Task Actions CLI 명령어로 변환
3. CLI 명령어 실행 후 결과를 MCP 형식으로 반환
4. AI 어시스턴트가 결과를 사용자에게 전달

## 문제 해결

### 자주 발생하는 문제

1. **CLI 파일을 찾을 수 없음**

   - 부모 프로젝트가 빌드되었는지 확인
   - `tools.ts`의 CLI 경로가 올바른지 확인

2. **권한 오류**

   - Node.js 실행 권한 확인
   - 프로젝트 디렉토리 접근 권한 확인

3. **타임아웃 오류**
   - CLI 명령어 실행 시간이 30초를 초과하는 경우
   - `tools.ts`의 타임아웃 값 조정 가능

## 라이선스

이 프로젝트는 부모 프로젝트와 동일한 라이선스를 따릅니다.
