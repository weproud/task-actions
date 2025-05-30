# task actions

Task Actions is a project inspired by task-master AI.
It's an MCP that enhances development productivity by restructuring
task management through task-master in a GitHub Actions style.

## task-actions cli

1. task-actions init

- Provides basic templates for task-actions.

2. task-actions add task

- Provides task templates that serve as the basic unit of development.

3. task-actions add rule

- Adds rules for task-actions.

4. task-actions add mcp

- Adds MCPs for task-actions.

5. task-actions add workflow

- Adds workflows for task-actions.

## templates basic directory structure

```
src/templates/
├── types.ts                           # YamlTemplate 인터페이스
├── index.ts                           # 모든 템플릿 통합 export
├── actions/
│   ├── index.ts                       # actions 통합 export
│   ├── create-branch.ts               # 브랜치 생성 템플릿
│   ├── create-pull-request.ts         # PR 생성 템플릿
│   ├── development.ts                 # 개발 템플릿
│   ├── git-commit.ts                  # Git 커밋 템플릿
│   ├── git-push.ts                    # Git 푸시 템플릿
│   └── task-done.ts                   # 태스크 완료 템플릿
├── base/
│   ├── index.ts                       # base 통합 export
│   ├── tasks.ts                       # 태스크 목록 템플릿
│   └── vars.ts                        # 환경 변수 템플릿
├── mcps/
│   ├── index.ts                       # mcps 통합 export
│   ├── context7.ts                    # Context7 MCP 템플릿
│   ├── playwright.ts                  # Playwright MCP 템플릿
│   └── sequential-thinking.ts         # Sequential Thinking MCP 템플릿
├── rules/
│   ├── index.ts                       # rules 통합 export
│   └── development-rule.ts            # 개발 규칙 템플릿
├── tasks/
│   ├── index.ts                       # tasks 통합 export
│   └── task-template.ts               # 태스크 템플릿
└── workflows/
    ├── index.ts                       # workflows 통합 export
    └── feature-development.ts         # 기능 개발 워크플로우 템플릿
```

## task-actions basic directory structure

```
.task-actions
├── actions
│   ├── create-branch.yaml
│   ├── create-pull-request.yaml
│   ├── development.yaml
│   ├── git-commit.yaml
│   ├── git-push.yaml
│   ├── send-message-discord.yaml
│   ├── send-message-slack.yaml
│   └── task-done.yaml
├── mcps
│   ├── context7.yaml
│   ├── playwright.yaml
│   └── sequential-thinking.yaml
├── rules
│   └── development-rule.yaml
├── task-0000.yaml
├── tasks.yaml
├── vars.yaml
└── workflows
    └── feature-development.yaml
```

## taks-0000.yaml
