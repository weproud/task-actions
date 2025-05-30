# Task Actions MCP Server

Task Actions CLI를 위한 **FastMCP** 기반 Model Context Protocol (MCP) 서버입니다.

## 🚀 빠른 시작

### NPM 패키지로 설치 (권장)

```bash
# Claude Desktop 설정에 추가만 하면 됩니다!
# npx가 자동으로 패키지를 설치하고 실행합니다.
```

### Claude Desktop 설정

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일에 다음을 추가:

```json
{
	"mcpServers": {
		"task-actions": {
			"command": "npx",
			"args": ["-y", "@modelcontextprotocol/task-actions"],
			"env": {},
			"description": "Task Actions AI - GitHub Actions 스타일의 개발 워크플로우를 관리하는 MCP 서버"
		}
	}
}
```

**설명:**

- `npx`: Node Package eXecute
- `-y`: 설치 확인을 자동으로 승인
- `@modelcontextprotocol/task-actions`: 설치할 패키지명

## ✨ 주요 기능

### 🎯 제공되는 MCP Tools

| Tool         | 설명                                  | 매개변수                          |
| ------------ | ------------------------------------- | --------------------------------- |
| `init`       | 프로젝트 초기화                       | 없음                              |
| `start_task` | 태스크 시작 (YAML 구조로 prompt 출력) | `taskId`, `output?`, `clipboard?` |

### 💡 사용 예시

Claude Desktop에서:

```
"새로운 task-actions 프로젝트를 초기화해 주세요."
→ init 도구 실행

"jwt-auth라는 태스크를 시작해주세요."
→ start_task 도구로 JWT 인증 태스크 시작 (YAML 구조로 출력)

"jwt 태스크를 파일로 저장해주세요."
→ start_task 도구로 파일 저장 옵션 사용
```

## 🔧 로컬 개발

### 1. 저장소 클론

```bash
git clone https://github.com/raiiz/task-actions.git
cd task-actions/mcp-server
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 빌드

```bash
npm run build
```

### 4. 로컬 개발용 Claude Desktop 설정

```json
{
	"mcpServers": {
		"task-actions-local": {
			"command": "node",
			"args": ["/your/path/to/task-actions/mcp-server/dist/index.js"],
			"env": {},
			"description": "Task Actions AI - 로컬 개발용 MCP 서버"
		}
	}
}
```

### 5. 개발 모드 실행

```bash
# 개발 서버 실행
npm run dev

# MCP Inspector로 웹 UI에서 테스트
npm run inspect
```

## 📦 FastMCP 기반 아키텍처

### ✨ FastMCP의 장점

1. **간단한 도구 정의**: Zod 스키마로 타입 안전성 보장
2. **자동 핫 리로드**: 개발 중 변경사항 즉시 반영
3. **웹 인터페이스**: `fastmcp inspect`로 브라우저에서 테스트
4. **이벤트 시스템**: 연결/해제 이벤트 처리

### 🛠️ 개발 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run inspect  # 웹 UI로 테스트
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 실행
```

## 🔗 관련 링크

- [Task Actions AI CLI](https://github.com/raiiz/task-actions)
- [FastMCP](https://github.com/jlowin/fastmcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 📄 라이선스

MIT License
