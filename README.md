# Task Actions CLI

A CLI tool for task automation systems similar to GitHub Actions.

## ✨ Recent Updates (Refactoring)

### 🔧 Major Improvements

#### 1. **Code Deduplication and Reusability Enhancement**

- Unified repetitive template generation patterns into `TemplateProcessor` class
- Centralized template configuration management with `template-config.ts`
- Separated file system operations into `FileSystemUtils` for improved reusability

#### 2. **Code Simplification**

- Split complex methods in `YamlGenerator` class into smaller, more understandable units
- Unified duplicate `generate*` methods with common logic
- Extracted error handling and validation logic into separate methods

#### 3. **Structural Improvements**

- Logically grouped related functionalities:
  - `FileSystemUtils`: File system operations
  - `TemplateProcessor`: Template processing logic
  - `TemplateEngine`: Enhanced template engine features
  - `template-config.ts`: Centralized template configuration
- Enhanced type safety and interface improvements
- Comprehensive error handling and validation logic

#### 4. **Performance Optimization**

- Minimized unnecessary file system access
- Optimized memory usage
- Improved efficiency through batch processing

### 🏗️ New Architecture

```
src/generator/
├── index.ts              # Main YamlGenerator class
├── types.ts              # Enhanced type definitions
├── template-config.ts    # Centralized template configuration
├── template-processor.ts # Template processing logic
├── template-engine.ts    # Enhanced template engine
└── file-system-utils.ts  # File system utilities
```

### 📊 Refactoring Results

- **Code Deduplication**: 90% reduction in similar patterns across `generate*` methods
- **Improved Maintainability**: Enhanced code comprehension and modification ease through separation of concerns
- **Better Extensibility**: Adding new template types now requires only configuration file modifications
- **Enhanced Error Handling**: Comprehensive validation and detailed error messages
- **Type Safety**: Strengthened TypeScript types to prevent runtime errors

---

## 🚀 Features

Generate and manage GitHub Actions-style workflows, actions, rules, and more for your projects.

### Supported Template Types

- **Actions**: Individual task units
- **Workflows**: Combinations of actions
- **MCPs**: Model Context Protocol
- **Rules**: Development rules
- **Tasks**: Project tasks

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g task-actions-ai
```

After installation, you can use the `task-actions` command anywhere:

```bash
task-actions --help
```

### Local Development Installation

To develop or test the project locally:

```bash
# Clone repository
git clone https://github.com/raiiz/task-actions.git
cd task-actions

# Install dependencies
npm install

# Build
npm run build

# Local link (for development)
npm link

# Now you can use task-actions command
task-actions --help
```

## 🤖 MCP Server (AI Assistant Integration) - FastMCP Based

Provides a **FastMCP-based** Model Context Protocol (MCP) server that allows Task Actions CLI to be integrated with AI assistants like Claude Desktop.

### ✨ **FastMCP 2.0 Upgrade**

- **Previous**: Based on `@modelcontextprotocol/sdk`
- **New**: Based on `fastmcp` (TypeScript framework)
- **Improvements**:
  - Automatic type safety through Zod schemas
  - Simpler tool definitions with less boilerplate
  - Built-in event system
  - Enhanced developer experience (`fastmcp dev`, `fastmcp inspect`)

### 🔧 MCP Server Installation

```bash
cd mcp-server
./install.sh
```

The installation script automatically:

1. Builds the parent project and MCP server
2. Installs FastMCP dependencies
3. Generates Claude Desktop configuration file examples
4. Guides you through the setup process

### ⚡ Quick Setup (Claude Desktop)

1. **Exit Claude Desktop**
2. **Edit configuration file** (macOS):

   ```bash
   # Open configuration file
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   Add the following content:

   ```json
   {
   	"mcpServers": {
   		"task-actions-local": {
   			"command": "node",
   			"args": [
   				"/Users/raiiz/labs/workspace/task-actions/mcp-server/dist/index.js"
   			],
   			"env": {},
   			"description": "Task Actions AI - Local development MCP server"
   		}
   	}
   }
   ```

3. **Restart Claude Desktop**

### 🧪 Development and Testing

Leverage FastMCP's powerful development tools:

```bash
cd mcp-server

# Interactive development server
npm run dev

# Test with web interface
npm run inspect

# Regular execution
npm start
```

### 🎯 Usage Examples in AI Assistant

You can interact with Claude Desktop as follows:

```
User: "Please initialize a new task-actions project."
Claude: I'll initialize the project using the init_project tool.

User: "Please generate action templates."
Claude: I'll generate action files using the add_action tool.

User: "Please create a task called user-auth."
Claude: I'll create a user authentication task using the add_task tool.
```

### 🔍 Available MCP Tools

| Tool               | Description                 | Parameters                            |
| ------------------ | --------------------------- | ------------------------------------- |
| `init_project`     | Initialize project          | None                                  |
| `add_action`       | Generate Action templates   | None                                  |
| `add_workflow`     | Generate Workflow templates | None                                  |
| `add_mcp`          | Generate MCP templates      | None                                  |
| `add_rule`         | Generate Rule templates     | None                                  |
| `add_task`         | Create new task             | `taskId`, `taskName?`, `description?` |
| `list_templates`   | List available templates    | `type?`                               |
| `check_status`     | Check project status        | `detailed?`                           |
| `validate_project` | Validate project            | None                                  |
| `clean_project`    | Clean project               | `force?`                              |
| `start_task`       | Start task                  | `taskId`, `output?`, `clipboard?`     |

For detailed MCP server setup and usage, refer to [`mcp-server/README.md`](./mcp-server/README.md).

## 🔧 Usage

### Project Initialization

```bash
task-actions init
```

### Generate Specific Types

```bash
# Generate only action files
task-actions generate action

# Generate only workflow files
task-actions generate workflow

# Generate only MCP files
task-actions generate mcp
```

### Create New Task

```bash
task-actions add task "new-feature-development" "Implement user authentication feature"
```

### Task Start and Development Prompt Generation

```bash
# Output basic YAML structure
task-actions start task <task-id>

# Save YAML structure to file
task-actions start task <task-id> --output task-structure.yaml

# Copy YAML structure to clipboard (macOS only)
task-actions start task <task-id> --clipboard

# Save to file and copy to clipboard simultaneously
task-actions start task <task-id> --output task-structure.yaml --clipboard
```

This command reads the task-jwt-provider.yaml file and outputs it in the same format as the Task YAML structure, displaying only the pure prompt content of referenced files (workflow, rules, mcps):

- Basic information and requirements of the Task
- Step-by-step prompts from Workflow (pure content without headers)
- Development rules defined in Rules (pure content without headers)
- Usage guides for MCPs (pure content without headers)

#### Task Structure Query

```bash
# Query prompts in Task YAML structure format
task-actions show task <task-id>
```

This command outputs in the same structure as the Task YAML file, displaying only the pure prompt content of referenced files.

### Task Completion and Notification Sending

```bash
# Mark task as completed and send Slack, Discord notifications
task-actions done <task-id>

# Complete task only without Slack notification
task-actions done <task-id> --skip-slack

# Complete task only without Discord notification
task-actions done <task-id> --skip-discord

# Complete task only without any notifications
task-actions done <task-id> --skip-slack --skip-discord

# Force re-completion of already completed task
task-actions done <task-id> --force
```

When task is completed, automatically:

- Change task status to 'done'
- Update tasks.yaml file
- Send completion notification to Slack if SLACK_WEBHOOK_URL is configured
- Send completion notification to Discord if DISCORD_WEBHOOK_URL is configured

### Slack and Discord Integration Setup

#### 1. Environment Variable Configuration

Add environment variables in the MCP server configuration:

**Claude Desktop Configuration (claude_desktop_config.json):**

```json
{
	"mcpServers": {
		"task-actions": {
			"command": "npx",
			"args": ["-y", "@modelcontextprotocol/task-actions"],
			"env": {
				"SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
				"DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK"
			},
			"description": "Task Actions AI - MCP server for managing GitHub Actions-style development workflows"
		}
	}
}
```

#### 2. Creating Slack Webhook URL

1. Create a new app at [Slack API](https://api.slack.com/apps)
2. Enable "Incoming Webhooks" feature
3. Select a channel and generate Webhook URL
4. Set the generated URL to `SLACK_WEBHOOK_URL` environment variable

#### 3. Creating Discord Webhook URL

1. Select the channel to receive notifications in your Discord server
2. Channel Settings → Integrations → Webhooks → Create New Webhook
3. Set webhook name and avatar (optional)
4. Click "Copy Webhook URL" to get the URL
5. Set the generated URL to `DISCORD_WEBHOOK_URL` environment variable

#### 4. Message Sending Examples

You can also send notifications programmatically:

```typescript
import {
	sendSlackMessage,
	sendDiscordMessage,
	notifyTaskCompletion,
	notifyTaskCompletionDiscord
} from 'task-actions';

// Slack 메시지
await sendSlackMessage('Hello, Slack!');

// Discord 메시지
await sendDiscordMessage('Hello, Discord!');

// 풍부한 형식의 Slack 메시지
await sendSlackMessage({
	text: '새로운 알림입니다!',
	username: 'Task Bot',
	icon_emoji: ':robot_face:',
	attachments: [
		{
			color: 'good',
			title: '작업 완료',
			fields: [
				{
					title: '프로젝트',
					value: 'My Project',
					short: true
				}
			]
		}
	]
});

// 풍부한 형식의 Discord 메시지
await sendDiscordMessage({
	content: '새로운 알림입니다!',
	username: 'Task Bot',
	embeds: [
		{
			color: 0x00ff00,
			title: '작업 완료',
			fields: [
				{
					name: '프로젝트',
					value: 'My Project',
					inline: true
				}
			]
		}
	]
});

// 태스크 완료 알림
await notifyTaskCompletion('TASK-001', '사용자 인증 구현', 'My Project');
await notifyTaskCompletionDiscord('TASK-001', '사용자 인증 구현', 'My Project');
```

### 사용 가능한 템플릿 목록 조회

```bash
task-actions list
```

## 🎯 예제

### 기본 프로젝트 구조 생성

```bash
task-actions init --project-name "my-project" --author "Developer Name"
```

This command creates the following structure:

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

### Programmatic Usage

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

// Generate all files
const stats = await generator.generateAll();

// Generate specific type only
await generator.generateByType('action');

// Generate new task
await generator.generateTask('001', 'Setup', 'Initial project setup');
```

## 🔗 Configuration Files

### vars.yaml

Defines project global variables.

```yaml
slack_webhook_url: 'https://hooks.slack.com/...'
discord_webhook_url: 'https://discord.com/api/webhooks/...'
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
