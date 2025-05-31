export const sampleTemplates = {
	action: {
		name: 'test-action',
		description: 'Test action template',
		content: `name: {{projectName}} Action
description: {{projectDescription}}
author: {{author}}
version: {{version}}

runs:
  using: node16
  main: index.js

inputs:
  message:
    description: 'Message to display'
    required: true
    default: 'Hello from {{projectName}}'`
	},

	workflow: {
		name: 'test-workflow',
		description: 'Test workflow template',
		content: `name: {{projectName}} Workflow
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test`
	},

	mcp: {
		name: 'test-mcp',
		description: 'Test MCP template',
		content: `name: {{projectName}} MCP
description: {{projectDescription}}
version: {{version}}

tools:
  - name: test-tool
    description: Test tool for {{projectName}}
    parameters:
      type: object
      properties:
        message:
          type: string
          description: Message to process`
	},

	rule: {
		name: 'test-rule',
		description: 'Test rule template',
		content: `name: {{projectName}} Rule
description: {{projectDescription}}
author: {{author}}

conditions:
  - type: file_changed
    pattern: "src/**/*.ts"

actions:
  - type: run_command
    command: npm test
  
  - type: notify
    message: "Tests completed for {{projectName}}"`
	}
};
