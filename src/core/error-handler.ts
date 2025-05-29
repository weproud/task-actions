import { ErrorInfo } from '../generator/types';

/**
 * 통일된 에러 처리 클래스
 */
export class ErrorHandler {
	/**
	 * CLI 에러를 일관된 형식으로 처리
	 */
	static handleCliError(
		operation: string,
		error: unknown,
		debugMode: boolean = false
	): never {
		console.error(`❌ ${operation} 중 오류가 발생했습니다:`, error);

		if (debugMode) {
			console.error('🐛 스택 트레이스:', error);
		}

		process.exit(1);
	}

	/**
	 * 에러 정보를 구조화된 형태로 변환
	 */
	static createErrorInfo(
		code: string,
		message: string,
		details?: Record<string, unknown>
	): ErrorInfo {
		return { code, message, details };
	}

	/**
	 * 에러가 특정 타입인지 확인
	 */
	static isErrorOfType(error: unknown, type: string): boolean {
		return error instanceof Error && error.name === type;
	}

	/**
	 * 파일 시스템 에러를 사용자 친화적 메시지로 변환
	 */
	static formatFileSystemError(error: unknown, operation: string): string {
		if (error instanceof Error) {
			if (error.message.includes('ENOENT')) {
				return `파일 또는 디렉토리를 찾을 수 없습니다.`;
			}
			if (error.message.includes('EACCES')) {
				return `파일 접근 권한이 없습니다.`;
			}
			if (error.message.includes('EEXIST')) {
				return `파일이 이미 존재합니다.`;
			}
		}
		return `${operation} 중 알 수 없는 오류가 발생했습니다.`;
	}

	/**
	 * 비동기 함수의 에러를 안전하게 처리
	 */
	static async safeExecute<T>(
		operation: () => Promise<T>,
		errorMessage: string
	): Promise<T | null> {
		try {
			return await operation();
		} catch (error) {
			console.warn(`⚠️ ${errorMessage}:`, error);
			return null;
		}
	}

	/**
	 * 여러 작업을 순차적으로 실행하며 에러를 수집
	 */
	static async executeWithErrorCollection<T>(
		operations: Array<() => Promise<T>>,
		continueOnError: boolean = true
	): Promise<{
		results: T[];
		errors: ErrorInfo[];
	}> {
		const results: T[] = [];
		const errors: ErrorInfo[] = [];

		for (const operation of operations) {
			try {
				const result = await operation();
				results.push(result);
			} catch (error) {
				const errorInfo = this.createErrorInfo(
					'OPERATION_FAILED',
					error instanceof Error ? error.message : String(error)
				);
				errors.push(errorInfo);

				if (!continueOnError) {
					break;
				}
			}
		}

		return { results, errors };
	}
}
