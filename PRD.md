# task actions

task actions는 task-master ai에 영감을 받아 만들어진 프로젝트야.
task-master를 통한 task관리를 github actions 방식으로 재구성해서
개발 생산성을 높이는 mcp야.

## task-actions cli

1. task-actions init

- task-actions의 기본 template을 제공한다.

2. task-actions add task

- 개발의 기본단위가 되는 task template을 제공한다.

3. task-actions add rule

- task-actions의 rule을 추가한다.

4. task-actions add mcp

- task-actions의 mcp를 추가한다.

5. task-actions add workflow

- task-actions의 workflow를 추가한다.

## task-actions 기본 디렉토리 구조

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
