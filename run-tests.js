#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Running validation tests...\n');

const jest = spawn('npx', ['jest', '--verbose', '--no-cache'], {
	cwd: __dirname,
	stdio: 'inherit'
});

jest.on('close', (code) => {
	if (code === 0) {
		console.log('\n✅ All tests passed!');
	} else {
		console.log('\n❌ Some tests failed.');
		process.exit(code);
	}
});

jest.on('error', (error) => {
	console.error('❌ Error running tests:', error);
	process.exit(1);
});
