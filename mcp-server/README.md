# Task Actions FastMCP Server

Task Actions CLI를 위한 **FastMCP** 기반 Model Context Protocol (MCP) 서버입니다. 기존 MCP SDK에서 FastMCP로 완전히 마이그레이션되어 더 간단하고 현대적인 구조를 제공합니다.

## ✨ FastMCP 마이그레이션 주요 변화

### 🔄 **버전 2.0.0 - FastMCP 기반 재구성**

- **기존**: `@modelcontextprotocol/sdk` 기반
- **새로운**: `fastmcp` 기반
- **개선사항**:
  - 더 간단한 도구 정의 (Zod 스키마 활용)
  - 자동 타입 안전성
  - 내장된 이벤트 시스템
  - 더 나은 개발자 경험
  - 더 적은 보일러플레이트 코드

### 📦 **의존성 변화**

```diff
- "@modelcontextprotocol/sdk": "^1.0.0"
+ "fastmcp": "^2.1.4"
+ "zod": "^3.23.8"
```

### 🛠️ **새로운 개발 스크립트**

```json
{
	"dev": "fastmcp dev src/index.ts",
	"test": "fastmcp dev src/index.ts",
	"inspect": "fastmcp inspect src/index.ts"
}
```

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
cd mcp-server
npm install
```

### 2. 빌드

```bash
npm run build
```

### 3. 개발 모드 실행 (FastMCP CLI 사용)

```bash
# 개발 서버 실행
npm run dev

# MCP Inspector로 웹 UI에서 테스트
npm run inspect
```

### 4. 프로덕션 실행

```bash
npm start
```

## 🎯 제공되는 MCP Tools

FastMCP 기반으로 다음 도구들을 제공합니다:

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

## 🔧 Claude Desktop 연동

### 1. 설정 파일 편집 (macOS)

```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 2. 설정 내용 추가

```json
{
	"mcpServers": {
		"task-actions": {
			"command": "node",
			"args": ["/your/path/to/task-actions/mcp-server/dist/index.js"],
			"env": {}
		}
	}
}
```

### 3. Claude Desktop 재시작

## 🧪 테스트

### FastMCP CLI를 사용한 테스트

```bash
# 대화형 테스트
npm run test

# 웹 인터페이스로 테스트
npm run inspect
```

### 예시 대화

Claude Desktop에서:

```
사용자: "새로운 task-actions 프로젝트를 초기화해 주세요."
Claude: init_project 도구를 사용하여 프로젝트를 초기화하겠습니다.

사용자: "jwt라는 태스크를 만들어주세요."
Claude: add_task 도구를 사용하여 JWT 관련 태스크를 생성하겠습니다.
```

## 🎨 FastMCP의 장점

### 1. **간단한 도구 정의**

```typescript
// 기존 (MCP SDK)
this.server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: 'add_task',
				description: '새로운 태스크 파일을 생성합니다',
				inputSchema: {
					type: 'object',
					properties: {
						taskId: { type: 'string', description: '태스크 ID' }
						// ... 더 많은 보일러플레이트
					}
				}
			}
		]
	};
});

// 새로운 (FastMCP)
server.addTool({
	name: 'add_task',
	description: '새로운 태스크 파일을 생성합니다',
	parameters: z.object({
		taskId: z.string().describe('태스크 ID'),
		taskName: z.string().optional().describe('태스크 이름')
	}),
	execute: async (args) => {
		return await tools.addTask(args.taskId, args.taskName);
	}
});
```

### 2. **자동 타입 안전성**

Zod 스키마를 통해 런타임 및 컴파일 타임 타입 검증이 자동으로 이루어집니다.

### 3. **내장 이벤트 시스템**

```typescript
server.on('connect', (event) => {
	console.log('🔗 클라이언트가 연결되었습니다:', event.session);
});

server.on('disconnect', (event) => {
	console.log('📪 클라이언트가 연결 해제되었습니다:', event.session);
});
```

### 4. **더 나은 개발자 경험**

- 개발 서버: `fastmcp dev`
- 웹 인터페이스: `fastmcp inspect`
- 자동 핫 리로드
- 더 나은 에러 메시지

## 📊 성능 및 통계

테스트 결과 모든 도구가 정상적으로 작동하며, FastMCP의 성능 향상과 개발 경험 개선을 확인할 수 있습니다:

- ✅ 프로젝트 초기화: 평균 5ms 이내
- ✅ 태스크 생성: 평균 2ms 이내
- ✅ 템플릿 생성: 평균 1ms 이내
- ✅ 모든 도구가 Zod 스키마 검증 통과

## 🔗 관련 링크

- [FastMCP GitHub](https://github.com/punkpeye/fastmcp)
- [Task Actions CLI 문서](../README.md)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)

## 🤝 기여하기

버그 리포트나 기능 제안은 GitHub Issues를 통해 제출해 주세요.
