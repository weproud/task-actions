# Task Actions - Makefile
# 배포, 실행, 테스트 등 필요한 기능들을 위한 Makefile

# 변수 설정
NODE_VERSION := 16
NPM := npm
PNPM := pnpm
TSC := npx tsc
NODEMON := npx nodemon
DIST_DIR := dist
MCP_DIR := mcp-server
SRC_DIR := src
TEST_DIR := test

# 색상 정의
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[0;37m
NC := \033[0m # No Color

# 기본 타겟
.PHONY: help
help: ## 사용 가능한 명령어들을 보여줍니다
	@echo "$(CYAN)Task Actions Makefile$(NC)"
	@echo "$(YELLOW)사용 가능한 명령어들:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# 설치 관련
.PHONY: install install-all install-mcp
install: ## 메인 프로젝트 의존성을 설치합니다
	@echo "$(BLUE)메인 프로젝트 의존성 설치 중...$(NC)"
	$(NPM) install

install-mcp: ## MCP 서버 의존성을 설치합니다
	@echo "$(BLUE)MCP 서버 의존성 설치 중...$(NC)"
	cd $(MCP_DIR) && $(NPM) install

install-all: install install-mcp ## 모든 의존성을 설치합니다
	@echo "$(GREEN)모든 의존성 설치 완료!$(NC)"

# 빌드 관련
.PHONY: build build-mcp build-all clean
build: ## 메인 프로젝트를 빌드합니다
	@echo "$(BLUE)메인 프로젝트 빌드 중...$(NC)"
	$(TSC)
	@echo "$(GREEN)메인 프로젝트 빌드 완료!$(NC)"

build-mcp: ## MCP 서버를 빌드합니다
	@echo "$(BLUE)MCP 서버 빌드 중...$(NC)"
	cd $(MCP_DIR) && $(NPM) run build
	@echo "$(GREEN)MCP 서버 빌드 완료!$(NC)"

build-all: build build-mcp ## 모든 프로젝트를 빌드합니다
	@echo "$(GREEN)모든 프로젝트 빌드 완료!$(NC)"

clean: ## 빌드 결과물을 정리합니다
	@echo "$(YELLOW)빌드 결과물 정리 중...$(NC)"
	rm -rf $(DIST_DIR)
	rm -rf $(MCP_DIR)/$(DIST_DIR)
	@echo "$(GREEN)정리 완료!$(NC)"

# 개발 관련
.PHONY: dev dev-mcp watch watch-mcp
dev: build ## 개발 모드로 메인 프로젝트를 실행합니다
	@echo "$(BLUE)개발 모드 실행 중...$(NC)"
	$(NPM) run dev

dev-mcp: ## MCP 서버를 개발 모드로 실행합니다
	@echo "$(BLUE)MCP 서버 개발 모드 실행 중...$(NC)"
	cd $(MCP_DIR) && $(NPM) run dev

watch: ## TypeScript 파일 변경을 감시하고 자동 빌드합니다
	@echo "$(BLUE)파일 변경 감시 중...$(NC)"
	$(TSC) -w

watch-mcp: ## MCP 서버 TypeScript 파일 변경을 감시합니다
	@echo "$(BLUE)MCP 서버 파일 변경 감시 중...$(NC)"
	cd $(MCP_DIR) && $(TSC) -w

# 실행 관련
.PHONY: start start-mcp run-cli
start: build ## 빌드된 메인 프로젝트를 실행합니다
	@echo "$(BLUE)메인 프로젝트 실행 중...$(NC)"
	node $(DIST_DIR)/index.js

start-mcp: build-mcp ## 빌드된 MCP 서버를 실행합니다
	@echo "$(BLUE)MCP 서버 실행 중...$(NC)"
	cd $(MCP_DIR) && node $(DIST_DIR)/index.js

run-cli: build ## CLI 명령어를 실행합니다 (예: make run-cli ARGS="init")
	@echo "$(BLUE)CLI 실행 중: task-actions $(ARGS)$(NC)"
	node $(DIST_DIR)/cli.js $(ARGS)

# 테스트 관련
.PHONY: test test-mcp test-all test-init test-slack
test: ## 메인 프로젝트 테스트를 실행합니다
	@echo "$(BLUE)메인 프로젝트 테스트 실행 중...$(NC)"
	@if [ -d "$(TEST_DIR)" ]; then \
		for test_file in $(TEST_DIR)/*.ts; do \
			if [ -f "$$test_file" ]; then \
				echo "$(CYAN)테스트 실행: $$test_file$(NC)"; \
				npx tsx "$$test_file" || true; \
			fi; \
		done; \
	else \
		echo "$(YELLOW)테스트 디렉토리가 없습니다.$(NC)"; \
	fi

test-mcp: build-mcp ## MCP 서버 테스트를 실행합니다
	@echo "$(BLUE)MCP 서버 테스트 실행 중...$(NC)"
	cd $(MCP_DIR) && $(NPM) run test

test-all: test test-mcp ## 모든 테스트를 실행합니다
	@echo "$(GREEN)모든 테스트 완료!$(NC)"

test-init: build ## 초기화 테스트를 실행합니다
	@echo "$(BLUE)초기화 테스트 실행 중...$(NC)"
	@if [ -d "$(TEST_DIR)/test-init" ]; then \
		cd $(TEST_DIR)/test-init && node ../../$(DIST_DIR)/cli.js init; \
	else \
		mkdir -p $(TEST_DIR)/test-init && cd $(TEST_DIR)/test-init && node ../../$(DIST_DIR)/cli.js init; \
	fi

test-slack: build ## Slack 테스트를 실행합니다
	@echo "$(BLUE)Slack 테스트 실행 중...$(NC)"
	@for test_file in $(TEST_DIR)/*slack*.ts; do \
		if [ -f "$$test_file" ]; then \
			echo "$(CYAN)Slack 테스트 실행: $$test_file$(NC)"; \
			npx tsx "$$test_file" || true; \
		fi; \
	done

# 배포 관련
.PHONY: publish publish-mcp publish-all version-patch version-minor version-major
version-patch: ## 패치 버전을 올립니다 (x.x.X)
	@echo "$(BLUE)패치 버전 업데이트 중...$(NC)"
	$(NPM) version patch
	cd $(MCP_DIR) && $(NPM) version patch

version-minor: ## 마이너 버전을 올립니다 (x.X.x)
	@echo "$(BLUE)마이너 버전 업데이트 중...$(NC)"
	$(NPM) version minor
	cd $(MCP_DIR) && $(NPM) version minor

version-major: ## 메이저 버전을 올립니다 (X.x.x)
	@echo "$(BLUE)메이저 버전 업데이트 중...$(NC)"
	$(NPM) version major
	cd $(MCP_DIR) && $(NPM) version major

publish: build ## 메인 프로젝트를 npm에 배포합니다
	@echo "$(BLUE)메인 프로젝트 배포 중...$(NC)"
	$(NPM) publish
	@echo "$(GREEN)메인 프로젝트 배포 완료!$(NC)"

publish-mcp: build-mcp ## MCP 서버를 npm에 배포합니다
	@echo "$(BLUE)MCP 서버 배포 중...$(NC)"
	cd $(MCP_DIR) && $(NPM) publish
	@echo "$(GREEN)MCP 서버 배포 완료!$(NC)"

publish-all: build-all publish publish-mcp ## 모든 프로젝트를 배포합니다
	@echo "$(GREEN)모든 프로젝트 배포 완료!$(NC)"

# 유틸리티
.PHONY: check-deps check-outdated update-deps lint format
check-deps: ## 의존성을 확인합니다
	@echo "$(BLUE)의존성 확인 중...$(NC)"
	$(NPM) ls
	@echo "$(CYAN)MCP 서버 의존성:$(NC)"
	cd $(MCP_DIR) && $(NPM) ls

check-outdated: ## 오래된 의존성을 확인합니다
	@echo "$(BLUE)오래된 의존성 확인 중...$(NC)"
	$(NPM) outdated || true
	@echo "$(CYAN)MCP 서버 오래된 의존성:$(NC)"
	cd $(MCP_DIR) && $(NPM) outdated || true

update-deps: ## 의존성을 업데이트합니다
	@echo "$(BLUE)의존성 업데이트 중...$(NC)"
	$(NPM) update
	cd $(MCP_DIR) && $(NPM) update
	@echo "$(GREEN)의존성 업데이트 완료!$(NC)"

# 설치 및 설정
.PHONY: setup setup-global link-global
setup: install-all build-all ## 프로젝트를 완전히 설정합니다
	@echo "$(GREEN)프로젝트 설정 완료!$(NC)"
	@echo "$(YELLOW)사용법:$(NC)"
	@echo "  $(CYAN)make run-cli ARGS=\"init\"$(NC) - CLI 초기화"
	@echo "  $(CYAN)make dev$(NC) - 개발 모드 실행"
	@echo "  $(CYAN)make test$(NC) - 테스트 실행"

setup-global: build-all ## 글로벌 설치를 위한 링크를 생성합니다
	@echo "$(BLUE)글로벌 링크 생성 중...$(NC)"
	$(NPM) link
	cd $(MCP_DIR) && $(NPM) link
	@echo "$(GREEN)글로벌 링크 생성 완료!$(NC)"
	@echo "$(YELLOW)이제 'task-actions' 명령어를 전역에서 사용할 수 있습니다.$(NC)"

link-global: setup-global ## setup-global의 별칭

# 정보 표시
.PHONY: info status
info: ## 프로젝트 정보를 표시합니다
	@echo "$(CYAN)Task Actions 프로젝트 정보$(NC)"
	@echo "$(YELLOW)메인 프로젝트:$(NC)"
	@echo "  - 이름: $$(node -p "require('./package.json').name")"
	@echo "  - 버전: $$(node -p "require('./package.json').version")"
	@echo "  - 설명: $$(node -p "require('./package.json').description")"
	@echo "$(YELLOW)MCP 서버:$(NC)"
	@echo "  - 이름: $$(node -p "require('./$(MCP_DIR)/package.json').name")"
	@echo "  - 버전: $$(node -p "require('./$(MCP_DIR)/package.json').version")"
	@echo "  - 설명: $$(node -p "require('./$(MCP_DIR)/package.json').description")"

status: ## 프로젝트 상태를 확인합니다
	@echo "$(CYAN)프로젝트 상태$(NC)"
	@echo "$(YELLOW)빌드 상태:$(NC)"
	@if [ -d "$(DIST_DIR)" ]; then echo "  ✅ 메인 프로젝트 빌드됨"; else echo "  ❌ 메인 프로젝트 빌드 필요"; fi
	@if [ -d "$(MCP_DIR)/$(DIST_DIR)" ]; then echo "  ✅ MCP 서버 빌드됨"; else echo "  ❌ MCP 서버 빌드 필요"; fi
	@echo "$(YELLOW)의존성 상태:$(NC)"
	@if [ -d "node_modules" ]; then echo "  ✅ 메인 프로젝트 의존성 설치됨"; else echo "  ❌ 메인 프로젝트 의존성 설치 필요"; fi
	@if [ -d "$(MCP_DIR)/node_modules" ]; then echo "  ✅ MCP 서버 의존성 설치됨"; else echo "  ❌ MCP 서버 의존성 설치 필요"; fi

# 기본 타겟
.DEFAULT_GOAL := help
