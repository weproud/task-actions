#!/usr/bin/env node

/**
 * MCP server test script
 * This script tests whether the MCP server works correctly.
 */

const { spawn } = require('child_process');
const path = require('path');

const testCases = [
	{
		name: 'List Tools',
		request: {
			jsonrpc: '2.0',
			id: 1,
			method: 'tools/list',
			params: {}
		}
	},
	{
		name: 'Call init_project tool',
		request: {
			jsonrpc: '2.0',
			id: 2,
			method: 'tools/call',
			params: {
				name: 'init_project',
				arguments: {}
			}
		}
	},
	{
		name: 'Call list_templates tool',
		request: {
			jsonrpc: '2.0',
			id: 3,
			method: 'tools/call',
			params: {
				name: 'list_templates',
				arguments: {}
			}
		}
	}
];

async function testMCPServer() {
	console.log('🧪 Starting MCP server test...\n');

	const serverPath = path.join(__dirname, 'dist', 'index.js');

	// Start MCP server
	const server = spawn('node', [serverPath], {
		stdio: ['pipe', 'pipe', 'pipe']
	});

	let testIndex = 0;
	let responses = [];

	server.stdout.on('data', (data) => {
		const output = data.toString();
		console.log('📨 Server response:', output);
		responses.push(output);
	});

	server.stderr.on('data', (data) => {
		console.log('ℹ️  Server log:', data.toString());
	});

	// Wait briefly for server to start
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Execute each test case
	for (const testCase of testCases) {
		console.log(`\n🔍 Test: ${testCase.name}`);
		console.log('📤 Request:', JSON.stringify(testCase.request, null, 2));

		server.stdin.write(JSON.stringify(testCase.request) + '\n');

		// Wait for response
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}

	// Terminate server
	server.kill();

	console.log('\n✅ Test completed!');
	console.log('\n📊 Test results:');
	console.log(`- Total test cases: ${testCases.length}`);
	console.log(`- Received responses: ${responses.length}`);

	if (responses.length > 0) {
		console.log('\n🎉 MCP server is working normally!');
	} else {
		console.log(
			'\n❌ No response received from MCP server. Please check server status.'
		);
	}
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
	testMCPServer().catch(console.error);
}

module.exports = { testMCPServer };
