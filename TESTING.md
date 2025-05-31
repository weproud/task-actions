# 테스트 가이드

Task Actions 프로젝트의 포괄적인 테스트 스위트에 대한 가이드입니다.

## 🧪 테스트 구조

### 디렉토리 구조

```
tests/
├── setup.ts                # Jest 전역 설정
├── helpers/                # 테스트 헬퍼 함수들
│   └── test-utils.ts       # 공통 유틸리티 함수
├── fixtures/               # 테스트용 고정 데이터
│   ├── sample-variables.ts # 테스트용 변수
│   └── sample-templates.ts # 테스트용 템플릿
├── unit/                   # 단위 테스트
│   ├── cli/               # CLI 명령어 테스트
│   │   ├── cli.test.ts    # 기본 CLI 테스트
│   │   └── add-commands.test.ts # Add 명령어 테스트
│   ├── core/              # 핵심 기능 테스트
│   │   ├── project.test.ts     # 프로젝트 관리 테스트
│   │   ├── validation.test.ts  # 검증 기능 테스트
│   │   └── utils.test.ts       # 유틸리티 함수 테스트
│   ├── generator/         # 템플릿 생성 테스트
│   │   ├── template-engine.test.ts      # 템플릿 엔진 테스트
│   │   └── file-system-utils.test.ts    # 파일 시스템 테스트
│   └── mcp/               # MCP 서버 테스트
│       └── tools.test.ts  # MCP 도구 테스트
├── integration/           # 통합 테스트
│   └── full-workflow.test.ts # 전체 워크플로우 테스트
└── performance/           # 성능 테스트
    └── performance.test.ts # 성능 벤치마크 테스트
```

## 🚀 테스트 실행

### 기본 명령어

```bash
# 모든 테스트 실행
npm test
make test

# 특정 테스트 타입 실행
make test-unit          # 단위 테스트
make test-integration   # 통합 테스트
make test-performance   # 성능 테스트

# 테스트 커버리지
make test-coverage

# 감시 모드 (개발 중)
make test-watch
```

### Jest 직접 실행

```bash
# 특정 테스트 파일 실행
npx jest tests/unit/cli/cli.test.ts

# 패턴으로 테스트 실행
npx jest --testNamePattern="init"

# 특정 디렉토리의 테스트 실행
npx jest tests/unit/core/

# 변경된 파일만 테스트
npx jest --onlyChanged

# 디버그 모드
npx jest --verbose
```

## 📋 테스트 카테고리

### 1. CLI 테스트 (`tests/unit/cli/`)

**테스트 대상:**
- `init` 명령어: 프로젝트 초기화
- `add` 명령어: 템플릿 파일 생성 (action, workflow, mcp, rule, task)
- `status` 명령어: 프로젝트 상태 확인
- `validate` 명령어: 프로젝트 검증
- `clean` 명령어: 프로젝트 정리
- `start` 명령어: 태스크 시작
- `list` 명령어: 템플릿 목록
- `slack` 명령어: Slack 알림

**주요 테스트 케이스:**
- 명령어 실행 성공/실패
- 파일 생성 확인
- 출력 메시지 검증
- 에러 처리

### 2. Core 기능 테스트 (`tests/unit/core/`)

**테스트 대상:**
- 프로젝트 관리 (`project.ts`)
- 검증 기능 (`validation.ts`)
- 유틸리티 함수 (`utils.ts`)
- 에러 핸들링 (`error-handler.ts`)

**주요 테스트 케이스:**
- 프로젝트 초기화/정리
- YAML 파일 검증
- Slack/Discord 알림
- 파일 시스템 작업

### 3. Generator 테스트 (`tests/unit/generator/`)

**테스트 대상:**
- 템플릿 엔진 (`template-engine.ts`)
- 파일 시스템 유틸리티 (`file-system-utils.ts`)
- 템플릿 프로세서

**주요 테스트 케이스:**
- 변수 치환
- 파일 읽기/쓰기
- 디렉토리 생성
- 템플릿 렌더링

### 4. MCP 서버 테스트 (`tests/unit/mcp/`)

**테스트 대상:**
- MCP 도구들 (`tools.ts`)
- CLI 명령어 실행
- 외부 프로세스 통신

**주요 테스트 케이스:**
- 명령어 실행
- 에러 처리
- 타임아웃 처리
- 출력 파싱

### 5. 통합 테스트 (`tests/integration/`)

**테스트 대상:**
- 전체 워크플로우
- 실제 파일 시스템 사용
- 명령어 체인 실행

**주요 테스트 케이스:**
- 프로젝트 생명주기
- 파일 생성 및 검증
- 에러 복구
- 대용량 데이터 처리

### 6. 성능 테스트 (`tests/performance/`)

**테스트 대상:**
- 명령어 실행 시간
- 메모리 사용량
- 대용량 파일 처리
- 동시 실행

**성능 기준:**
- 프로젝트 초기화: 5초 이내
- 파일 생성: 10초 이내
- 검증: 3초 이내
- 상태 확인: 2초 이내

## 🛠️ 테스트 작성 가이드

### 테스트 파일 구조

```typescript
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createTempDir, cleanupTempDir } from '../../helpers/test-utils';

describe('기능명', () => {
    let tempDir: string;

    beforeEach(() => {
        tempDir = createTempDir();
        // 테스트 전 설정
    });

    afterEach(() => {
        cleanupTempDir(tempDir);
        // 테스트 후 정리
    });

    describe('세부 기능', () => {
        it('should 예상 동작', async () => {
            // Given
            // When
            // Then
            expect(result).toBe(expected);
        });
    });
});
```

### 모킹 가이드

```typescript
// 파일 시스템 모킹
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// 프로세스 실행 모킹
jest.mock('child_process');
const mockExec = exec as jest.MockedFunction<typeof exec>;

// 콘솔 출력 캡처
const consoleCapture = captureConsoleOutput();
```

### 헬퍼 함수 사용

```typescript
// 임시 디렉토리 생성
const tempDir = createTempDir();

// 테스트 변수 생성
const variables = createTestVariables();

// 콘솔 출력 캡처
const { logs, errors, restore } = captureConsoleOutput();
```

## 📊 커버리지 목표

- **전체 커버리지**: 80% 이상
- **함수 커버리지**: 90% 이상
- **라인 커버리지**: 85% 이상
- **브랜치 커버리지**: 75% 이상

## 🐛 디버깅

### 테스트 실패 시 확인사항

1. **환경 변수**: `NODE_ENV=test` 설정 확인
2. **파일 권한**: 임시 파일 생성/삭제 권한 확인
3. **모킹**: 외부 의존성이 올바르게 모킹되었는지 확인
4. **비동기 처리**: async/await 올바른 사용 확인

### 로그 확인

```bash
# 상세 로그와 함께 테스트 실행
npx jest --verbose --no-coverage

# 특정 테스트만 디버그
npx jest --testNamePattern="특정테스트" --verbose
```

## 🔄 CI/CD 통합

GitHub Actions에서 자동으로 실행되는 테스트:

```yaml
- name: Run tests
  run: |
    npm test
    npm run test:coverage
```

## 📝 테스트 작성 체크리스트

- [ ] 테스트 이름이 명확하고 설명적인가?
- [ ] Given-When-Then 패턴을 따르는가?
- [ ] 모든 에러 케이스를 다루는가?
- [ ] 외부 의존성이 올바르게 모킹되었는가?
- [ ] 테스트 후 정리가 제대로 되는가?
- [ ] 테스트가 독립적으로 실행 가능한가?
- [ ] 성능 테스트에 적절한 타임아웃이 설정되었는가?
