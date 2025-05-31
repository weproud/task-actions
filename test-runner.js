const { execSync } = require('child_process');

console.log('🧪 테스트 실행을 시작합니다...\n');

try {
	// Jest 테스트 실행 (간단한 테스트만)
	console.log('🧪 간단한 테스트 실행 중...');
	execSync('npx jest tests/simple.test.ts --verbose --no-coverage', {
		stdio: 'inherit',
		cwd: process.cwd(),
		timeout: 30000
	});
	console.log('✅ 간단한 테스트 성공\n');

	console.log('🎉 테스트가 성공했습니다!');
} catch (error) {
	console.error('❌ 테스트 실행 중 오류가 발생했습니다:');
	console.error(error.message);

	if (error.stdout) {
		console.log('\n📤 stdout:');
		console.log(error.stdout.toString());
	}

	if (error.stderr) {
		console.log('\n📥 stderr:');
		console.log(error.stderr.toString());
	}

	process.exit(1);
}
