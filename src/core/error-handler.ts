import { ErrorInfo } from '../generator/types';

/**
 * Unified error handling class
 */
export class ErrorHandler {
	/**
	 * Handle CLI errors in consistent format
	 */
	static handleCliError(
		operation: string,
		error: unknown,
		debugMode: boolean = false
	): never {
		console.error(`❌ An error occurred during ${operation}:`, error);

		if (debugMode) {
			console.error('🐛 Stack trace:', error);
		}

		process.exit(1);
	}

	/**
	 * Convert error information to structured format
	 */
	static createErrorInfo(
		code: string,
		message: string,
		details?: Record<string, unknown>
	): ErrorInfo {
		return { code, message, details };
	}

	/**
	 * Check if error is of specific type
	 */
	static isErrorOfType(error: unknown, type: string): boolean {
		return error instanceof Error && error.name === type;
	}

	/**
	 * Convert file system errors to user-friendly messages
	 */
	static formatFileSystemError(error: unknown, operation: string): string {
		if (error instanceof Error) {
			if (error.message.includes('ENOENT')) {
				return `File or directory not found.`;
			}
			if (error.message.includes('EACCES')) {
				return `No file access permission.`;
			}
			if (error.message.includes('EEXIST')) {
				return `File already exists.`;
			}
		}
		return `An unknown error occurred during ${operation}.`;
	}

	/**
	 * Safely handle errors from async functions
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
