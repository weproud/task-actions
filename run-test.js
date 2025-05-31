const { spawn } = require('child_process');

console.log('🧪 테스트 실행 중...\n');

const jest = spawn('npx', ['jest', 'tests/simple.test.ts', '--verbose', '--no-coverage'], {
	stdio: 'inherit',
	cwd: process.cwd()
});

jest.on('close', (code) => {
	if (code === 0) {
		console.log('\n✅ 테스트가 성공했습니다!');
	} else {
		console.log(`\n❌ 테스트가 실패했습니다. 종료 코드: ${code}`);
		process.exit(code);
	}
});

jest.on('error', (error) => {
	console.error('❌ 테스트 실행 중 오류가 발생했습니다:', error);
	process.exit(1);
});
