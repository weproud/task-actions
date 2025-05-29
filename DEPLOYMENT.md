# Task Actions CLI - NPM 배포 가이드

## 🚀 배포 준비 완료!

task-actions CLI는 이제 npm에 배포할 준비가 완료되었습니다.

## 📋 배포 체크리스트

✅ **package.json 설정 완료**

- CLI bin 설정: `./dist/cli.js`
- 메타데이터 (description, keywords, author, license)
- files 필드로 배포 파일 명시
- prepublishOnly 스크립트 설정

✅ **빌드 파일 생성**

- TypeScript 컴파일 완료
- CLI 실행 권한 설정
- Shebang (`#!/usr/bin/env node`) 포함

✅ **.npmignore 설정**

- 소스 파일 및 개발 파일 제외
- 테스트 파일 제외
- 불필요한 파일들 필터링

✅ **CLI 테스트 완료**

- 로컬 npm link 테스트 완료
- `task-actions --help` 정상 동작 확인

## 🔐 NPM 배포 단계

### 1. NPM 로그인

```bash
npm login
```

계정이 없다면:

```bash
npm adduser
```

### 2. 패키지 이름 확인

```bash
npm view task-actions-ai
```

> ✅ `task-actions-ai` 패키지 이름 사용 가능 확인됨

### 3. 배포 실행

```bash
# Dry run으로 한 번 더 확인
npm publish --dry-run

# 실제 배포
npm publish
```

### 4. 배포 확인

```bash
# 패키지 설치 테스트
npm install -g task-actions-ai

# CLI 동작 확인
task-actions --help
```

## 📦 패키지 정보

- **패키지명**: `task-actions-ai`
- **버전**: `1.0.0`
- **CLI 명령어**: `task-actions`
- **Node.js 요구사항**: `>= 16.0.0`
- **패키지 크기**: ~35.4 kB (압축)
- **포함 파일**: 49개

## 🎯 설치 후 사용법

사용자들은 다음과 같이 설치하고 사용할 수 있습니다:

```bash
# 전역 설치
npm install -g task-actions-ai

# 사용
task-actions init
task-actions add action
task-actions --help
```

## 🔄 버전 업데이트

새 버전 배포 시:

```bash
# 버전 업데이트
npm version patch  # 1.0.1
npm version minor  # 1.1.0
npm version major  # 2.0.0

# 빌드 및 배포
npm run build
npm publish
```

## 📚 추가 정보

- 패키지 페이지: https://www.npmjs.com/package/task-actions-ai (배포 후)
- 소스 코드: https://github.com/raiiz/task-actions
- 이슈 리포트: https://github.com/raiiz/task-actions/issues
