# Validation Tests

이 디렉토리는 `src/core/validation.ts` 파일에 대한 포괄적인 테스트 케이스를 포함합니다.

## 테스트 구조

```
tests/
├── core/
│   ├── validation.test.ts      # 메인 validation 함수들 테스트
│   └── validation-utils.test.ts # 유틸리티 함수들 테스트
├── fixtures/
│   ├── valid/                  # 유효한 테스트 파일들
│   ├── invalid/                # 무효한 테스트 파일들
│   └── circular/               # 순환 참조 테스트 파일들
├── setup.ts                    # Jest 설정 및 유틸리티
└── README.md                   # 이 파일
```

## 테스트 실행

### 모든 테스트 실행
```bash
npm test
```

### 특정 테스트 파일 실행
```bash
npm test validation.test.ts
npm test validation-utils.test.ts
```

### 커버리지 포함 테스트
```bash
npm run test:coverage
```

### Watch 모드
```bash
npm run test:watch
```

## 테스트 케이스 개요

### 1. 타입 가드 테스트 (`validation.test.ts`)
- `isWorkflowConfig()`: 워크플로우 설정 검증
- `isTaskConfig()`: 태스크 설정 검증

### 2. 파일 로딩 및 파싱 테스트
- 유효한 YAML 파일 로딩
- 파일 존재하지 않음 처리
- 빈 파일 처리
- 잘못된 YAML 구문 처리

### 3. 필드 검증 테스트
- 필수 필드 누락 감지
- 빈 필드 값 처리
- null/undefined 값 처리

### 4. 프로젝트 검증 테스트
- 초기화된 프로젝트 검증
- 초기화되지 않은 프로젝트 감지
- 필수 기본 파일 누락 감지
- 태스크 파일 없음 처리
- 디렉토리 읽기 오류 처리

### 5. 태스크 파일 검증 테스트
- 커스텀 job 타입 검증
- 잘못된 커스텀 job 타입 감지
- jobs 섹션 누락 감지

### 6. 워크플로우 검증 테스트
- 워크플로우 steps 누락 감지
- 잘못된 워크플로우 구조 처리

### 7. 순환 참조 감지 테스트
- 파일 간 순환 참조 감지
- 자기 참조 감지

### 8. 에러 처리 테스트
- 파일 시스템 오류 처리
- YAML 파싱 오류 처리
- 권한 오류 처리

### 9. 유틸리티 함수 테스트 (`validation-utils.test.ts`)
- `validateYamlFiles()` 함수 테스트
- 빈 파일 감지
- 파일 읽기 오류 처리
- 특수 문자 파일명 처리
- 성능 테스트

## 테스트 픽스처

### 유효한 파일들 (`fixtures/valid/`)
- `task-example.yaml`: 완전한 태스크 파일 예제
- `workflow-example.yaml`: 워크플로우 파일 예제
- `action-example.yaml`: 액션 파일 예제
- `rule-example.yaml`: 룰 파일 예제
- `mcp-example.yaml`: MCP 파일 예제

### 무효한 파일들 (`fixtures/invalid/`)
- `missing-fields.yaml`: 필수 필드 누락
- `empty.yaml`: 빈 파일
- `invalid-yaml.yaml`: 잘못된 YAML 구문

### 순환 참조 파일들 (`fixtures/circular/`)
- `workflow-a.yaml`: 순환 참조를 만드는 워크플로우
- `action-b.yaml`: 순환 참조에 참여하는 액션

## Mock 전략

테스트에서는 다음 모듈들을 모킹합니다:
- `fs/promises`: 파일 시스템 작업 시뮬레이션
- `FileSystemUtils`: 파일 유틸리티 함수들
- `console.log`: 출력 검증

## 테스트 작성 가이드

새로운 테스트를 추가할 때:

1. **적절한 describe 블록에 추가**: 기능별로 그룹화
2. **명확한 테스트 이름 사용**: 무엇을 테스트하는지 명확히
3. **Mock 설정**: beforeEach에서 mock 초기화
4. **정리**: afterEach에서 mock 복원
5. **픽스처 사용**: 가능한 한 기존 픽스처 재사용

### 예제:
```typescript
test('should handle new validation scenario', async () => {
    // Arrange
    const testData = 'test yaml content';
    mockFs.readFile.mockResolvedValue(testData);
    
    // Act
    const result = await validateProject();
    
    // Assert
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
});
```

## 커버리지 목표

- **라인 커버리지**: 90% 이상
- **함수 커버리지**: 95% 이상
- **브랜치 커버리지**: 85% 이상

현재 테스트는 validation.ts 파일의 모든 주요 기능을 커버하며, 에러 케이스와 엣지 케이스를 포함합니다.
