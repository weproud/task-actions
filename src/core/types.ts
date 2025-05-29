// 기본 타입들 (generator에서 가져올 수 있지만 core에서 독립적으로 사용)
export interface ProjectStatus {
	isInitialized: boolean;
	hasRequiredFiles: boolean;
	missingFiles: string[];
	variables?: any;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

export interface CleanOptions {
	force: boolean;
}

export interface StatusOptions {
	detailed?: boolean;
}
