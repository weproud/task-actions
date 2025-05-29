import { YamlTemplate } from '../types';

export const REFACTORING_RULE_TEMPLATE: YamlTemplate = {
	name: 'rules/refactoring-rule.yaml',
	description: '{{projectName}} 코드 리팩토링 작업 시 따라야 할 규칙들',
	content: {
		version: 1,
		kind: 'rule',
		name: 'Refactoring Rule',
		description: '{{projectName}} 코드 리팩토링 작업 시 따라야 할 규칙들',
		prompt: `{{projectName}} 코드 리팩토링 시 다음 규칙을 따르세요:

## 코드 품질 개선
- 중복 코드 제거 및 공통 유틸리티 함수로 추출
- 의미있는 변수명과 함수명 사용 (명확하고 설명적)
- 복잡한 조건문을 함수로 분리하여 가독성 향상
- 매직넘버 제거 및 상수로 관리
- 타입 안전성 강화 (TypeScript strict 모드 활용)

## 구조 개선
- 단일 책임 원칙(SRP)에 따른 함수/클래스 분리
- 의존성 역전을 통한 결합도 감소
- 적절한 추상화 레벨 유지
- 폴더 구조 정리 및 관심사 분리
- 인터페이스와 추상화를 통한 유연한 설계

## 성능 최적화
- 불필요한 렌더링 최소화 (React.memo, useMemo, useCallback 활용)
- 중복 API 호출 제거 및 캐싱 전략 적용
- 번들 크기 최적화 (코드 스플리팅, 트리 쉐이킹)
- 메모리 누수 방지 (이벤트 리스너 정리, useEffect cleanup)
- 효율적인 데이터 구조 및 알고리즘 선택

## 유지보수성 향상
- 명확한 주석과 문서화 추가
- 테스트 커버리지 확보 및 테스트 가능한 코드 작성
- 설정값 외부화 및 환경변수 활용
- 에러 핸들링 개선 및 사용자 친화적 메시지
- 로깅 체계 구축 및 디버깅 정보 제공

## 리팩토링 원칙
- 작은 단위로 점진적 개선
- 기능 변경 없이 구조만 개선
- 리팩토링 전후 테스트 실행으로 동작 검증
- 코드 리뷰를 통한 품질 확보
`
	}
};
