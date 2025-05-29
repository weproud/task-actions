#!/usr/bin/env node

/**
 * MCP 서버 테스트 스크립트
 * 이 스크립트는 MCP 서버가 올바르게 작동하는지 테스트합니다.
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
	console.log('🧪 MCP 서버 테스트를 시작합니다...\n');

	const serverPath = path.join(__dirname, 'dist', 'index.js');

	// MCP 서버 시작
	const server = spawn('node', [serverPath], {
		stdio: ['pipe', 'pipe', 'pipe']
	});

	let testIndex = 0;
	let responses = [];

	server.stdout.on('data', (data) => {
		const output = data.toString();
		console.log('📨 서버 응답:', output);
		responses.push(output);
	});

	server.stderr.on('data', (data) => {
		console.log('ℹ️  서버 로그:', data.toString());
	});

	// 서버가 시작될 때까지 잠시 대기
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// 각 테스트 케이스 실행
	for (const testCase of testCases) {
		console.log(`\n🔍 테스트: ${testCase.name}`);
		console.log('📤 요청:', JSON.stringify(testCase.request, null, 2));

		server.stdin.write(JSON.stringify(testCase.request) + '\n');

		// 응답을 기다림
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}

	// 서버 종료
	server.kill();

	console.log('\n✅ 테스트 완료!');
	console.log('\n📊 테스트 결과:');
	console.log(`- 총 테스트 케이스: ${testCases.length}`);
	console.log(`- 수신된 응답: ${responses.length}`);

	if (responses.length > 0) {
		console.log('\n🎉 MCP 서버가 정상적으로 작동하고 있습니다!');
	} else {
		console.log(
			'\n❌ MCP 서버 응답을 받지 못했습니다. 서버 상태를 확인해주세요.'
		);
	}
}

// 스크립트가 직접 실행될 때만 테스트 실행
if (require.main === module) {
	testMCPServer().catch(console.error);
}

module.exports = { testMCPServer };
