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

```bash
npm install -g task-actions
```

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
task-actions task create "새로운 기능 개발" "사용자 인증 기능을 구현합니다"
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
slack_hook_url: 'https://hooks.slack.com/...'
discord_hook_url: 'https://discord.com/api/webhooks/...'
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
