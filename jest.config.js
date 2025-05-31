/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	testTimeout: 30000,
	clearMocks: true,
	resetMocks: true,
	maxWorkers: 1,
	// Watch 모드 설정
	watchman: false, // Watchman 비활성화 (macOS에서 문제 발생 시)
	watchPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/dist/',
		'<rootDir>/coverage/',
		'<rootDir>/.git/'
	],
	// 파일 변경 감지 설정
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/index.ts'],
	coverageDirectory: 'coverage'
};
