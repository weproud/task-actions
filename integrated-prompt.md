# 🎯 Task Development Prompt

## Task Information
- **ID**: jwt
- **Name**: JWT 인증 구현
- **Status**: todo
- **Generated**: 2025-05-30T00:55:49.750Z

## Task Requirements
<여기에 태스크 설명을 입력하세요>
		JWT 기반 인증 시스템을 구현합니다

---

# Task: JWT 인증 구현
<여기에 태스크 설명을 입력하세요>
		JWT 기반 인증 시스템을 구현합니다

---

## Workflow: Feature Development
task-actions-ai Feature Development 작업을 수행한다.

---

### Step: Create a new feature branch
#### Action: Create Branch
새로운 Git 브랜치를 생성한다
feature/ prefix를 사용하여 적절한 브랜치명을 생성하고, 최신 main/develop 브랜치에서 새 브랜치를 생성하여 체크아웃합니다.

---

### Step: Test
#### Action: Test
프로젝트의 테스트를 실행합니다
프로젝트의 테스트를 실행합니다.

다음 단계를 수행하세요:
1. 테스트 환경 설정 확인
2. 패키지 의존성 설치 확인
3. 단위 테스트 실행
4. 통합 테스트 실행 (있는 경우)
5. 테스트 결과 보고
6. 테스트 실패 시 원인 분석 및 해결 방안 제시

테스트 명령어는 package.json의 scripts를 우선 확인하고, 프로젝트에 맞는 테스트 프레임워크를 사용하세요.

---

### Step: Commit the changes
#### Action: Git Commit
변경사항을 Git에 커밋한다
변경된 파일들을 확인하고 스테이징한 후, 의미 있는 커밋 메시지(feat:, fix:, docs: 등 컨벤션 사용)와 함께 커밋을 실행합니다.


---

### Step: Push the changes
#### Action: Git Push
로컬 변경사항을 원격 저장소에 푸시한다
현재 브랜치의 변경사항을 원격 저장소에 푸시하고, 필요시 upstream을 설정합니다.

---

### Step: Create a pull request
#### Action: Create Pull Request
개발 완료된 기능에 대한 Pull Request를 생성합니다
명확한 제목과 설명으로 PR을 작성하고, 적절한 리뷰어와 라벨을 설정하여 Pull Request를 생성합니다.

---

### Step: Send a message to Slack
#### Action: Send Message to Slack
Slack 채널에 메시지를 전송합니다
Slack 채널에 메시지를 전송합니다.

다음 정보가 필요합니다:
- SLACK_WEBHOOK_URL 환경 변수에 설정된 Slack 웹훅 URL
- 전송할 메시지 내용
- 선택사항: 메시지 형식 (일반 텍스트, 마크다운, JSON 등)

다음 단계를 수행하세요:
1. 환경 변수에서 SLACK_WEBHOOK_URL 확인
2. 메시지 형식 및 내용 준비
3. HTTP POST 요청으로 Slack 웹훅에 메시지 전송
4. 전송 결과 확인 및 오류 처리

SLACK_WEBHOOK_URL 환경 변수가 설정되어 있지 않으면 사용자에게 설정을 요청하세요.

예시 메시지 형식:
{
  "text": "메시지 내용",
  "channel": "#general",
  "username": "Bot",
  "icon_emoji": ":robot_face:"
}

curl 예시:
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Hello, World!"}' \
${SLACK_WEBHOOK_URL}

---

## Rule: Development Rule
task-actions-ai 개발 작업 시 따라야 할 규칙들
task-actions-ai 개발 시 다음 규칙을 따르세요:
- TypeScript, ESLint, Prettier 사용으로 코드 품질 보장
- 의미있는 커밋 메시지와 feature/ prefix 브랜치 사용  
- Pull Request를 통한 코드 리뷰 필수
- 문서화(README, 주석, API 문서) 유지
- 복잡한 작업시 sequential-thinking, context7, playwright 활용


---

## MCP: sequential-thinking
복잡한 문제 해결을 위한 단계적 사고 과정
복잡한 문제나 태스크 해결 시 sequential-thinking을 활용합니다. 문제를 단계별로 분해하고, 논리적 순서로 접근하여 반복적으로 개선해나갑니다.

---

## MCP: context7
Context7을 통한 라이브러리 문서 검색
라이브러리나 프레임워크 사용 시 Context7을 활용합니다. 최신 버전의 공식 문서를 참조하여 정확한 구현과 베스트 프랙티스를 따릅니다.


---

## MCP: playwright
Playwright를 통한 브라우저 자동화 및 테스트
Playwright를 사용한 브라우저 자동화 및 E2E 테스트를 수행합니다. 사용자 시나리오 기반 테스트 작성, 크로스 브라우저 테스트, 성능 및 접근성 테스트를 포함합니다.

---

## 개발 지침
위의 모든 정보를 종합하여 Task "JWT 인증 구현"을 개발하세요.

1. **Task 요구사항**을 주의 깊게 분석하세요
2. **Workflow 단계**를 따라 체계적으로 진행하세요  
3. **Rules**에 명시된 개발 규칙을 준수하세요
4. **MCPs**를 적극적으로 활용하여 효율적으로 개발하세요

**시작 시간**: 2025-05-30T00:55:49.750Z
**다음 단계**: 개발 환경 설정 및 기본 구조 생성

Good luck! 🚀