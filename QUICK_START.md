# Task Actions MCP 서버 빠른 시작 가이드

Claude Desktop에서 Task Actions CLI를 사용할 수 있도록 MCP 서버를 설정하는 빠른 가이드입니다.

## 🚀 1단계: 설치

```bash
# MCP 서버 디렉토리로 이동
cd mcp-server

# 자동 설치 스크립트 실행
./install.sh
```

이 스크립트는 자동으로:

- 부모 프로젝트와 MCP 서버를 빌드
- Claude Desktop 설정 파일 예제를 생성
- 다음 단계를 안내

## ⚡ 2단계: Claude Desktop 설정

### macOS

1. **Claude Desktop 종료**

2. **설정 파일 열기:**

   ```bash
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **다음 설정 추가:**

   ```json
   {
   	"mcpServers": {
   		"task-actions": {
   			"command": "node",
   			"args": [
   				"/Users/raiiz/labs/workspace/task-actions/mcp-server/dist/index.js"
   			],
   			"env": {}
   		}
   	}
   }
   ```

   > **⚠️ 중요:** 위 경로를 실제 프로젝트 경로로 변경하세요!

4. **Claude Desktop 재시작**

### Windows

1. **Claude Desktop 종료**

2. **설정 파일 열기:** `%APPDATA%\Claude\claude_desktop_config.json`

3. **위와 동일한 설정 추가** (경로는 Windows 형식으로 변경)

4. **Claude Desktop 재시작**

## 🎯 3단계: 테스트

Claude Desktop에서 다음 중 하나를 시도해보세요:

```
새로운 task-actions 프로젝트를 초기화해 주세요.
```

```
action 템플릿을 생성해 주세요.
```

```
사용 가능한 템플릿 목록을 보여주세요.
```

## 🔧 문제 해결

### MCP 서버가 연결되지 않는 경우

1. **경로 확인:**

   - 설정 파일의 경로가 정확한지 확인
   - `dist/index.js` 파일이 존재하는지 확인

2. **권한 확인:**

   ```bash
   # MCP 서버 디렉토리에서
   ls -la dist/index.js
   ```

3. **수동 테스트:**

   ```bash
   # MCP 서버 디렉토리에서
   npm test
   ```

4. **Claude Desktop 로그 확인:**
   - Claude Desktop 개발자 도구 열기
   - Console에서 오류 메시지 확인

### 빌드 오류가 발생하는 경우

```bash
# 부모 프로젝트에서
npm run build

# MCP 서버에서
cd mcp-server
npm run build
```

## 📋 사용 가능한 명령어

| 명령어                          | 설명                  |
| ------------------------------- | --------------------- |
| "프로젝트 초기화해주세요"       | `init_project` 실행   |
| "action 템플릿 생성해주세요"    | `add_action` 실행     |
| "workflow 템플릿 생성해주세요"  | `add_workflow` 실행   |
| "mcp 템플릿 생성해주세요"       | `add_mcp` 실행        |
| "rule 템플릿 생성해주세요"      | `add_rule` 실행       |
| "user-auth 태스크 만들어주세요" | `add_task` 실행       |
| "템플릿 목록 보여주세요"        | `list_templates` 실행 |
| "프로젝트 상태 확인해주세요"    | `check_status` 실행   |

## 🎉 성공!

모든 설정이 완료되면 Claude가 Task Actions CLI 도구들을 직접 사용할 수 있습니다.
이제 자연어로 프로젝트 관리 작업을 수행할 수 있습니다!
