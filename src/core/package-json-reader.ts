import * as path from 'path';
import { FileSystemUtils } from '../generator';

/**
 * Package.json 파일 읽기 전용 유틸리티 클래스
 * 중복된 package.json 읽기 로직을 통합
 */
export class PackageJsonReader {
	private static packageJsonCache: Record<string, any> = {};

	/**
	 * 지정된 디렉토리의 package.json 파일을 읽어옴
	 */
	static readPackageJson(directory: string = process.cwd()): any | null {
		const packageJsonPath = path.join(directory, 'package.json');

		// 캐시에서 확인
		if (this.packageJsonCache[packageJsonPath]) {
			return this.packageJsonCache[packageJsonPath];
		}

		if (!FileSystemUtils.fileExists(packageJsonPath)) {
			return null;
		}

		try {
			const content = FileSystemUtils.readFile(packageJsonPath);
			const packageJson = JSON.parse(content);
			
			// 캐시에 저장
			this.packageJsonCache[packageJsonPath] = packageJson;
			
			return packageJson;
		} catch (error) {
			console.warn(`package.json 파일 읽기 실패: ${packageJsonPath}`);
			return null;
		}
	}

	/**
	 * 프로젝트 이름 가져오기
	 */
	static getProjectName(directory: string = process.cwd()): string {
		const packageJson = this.readPackageJson(directory);
		
		if (packageJson?.name) {
			return packageJson.name;
		}

		// package.json이 없거나 name이 없으면 디렉토리 이름 사용
		return path.basename(directory);
	}

	/**
	 * 작성자 정보 가져오기
	 */
	static getAuthor(directory: string = process.cwd()): string {
		const packageJson = this.readPackageJson(directory);
		
		if (packageJson?.author) {
			// author가 객체인 경우 name 속성 사용
			if (typeof packageJson.author === 'object' && packageJson.author.name) {
				return packageJson.author.name;
			}
			
			// author가 문자열인 경우 그대로 사용
			if (typeof packageJson.author === 'string') {
				return packageJson.author;
			}
		}

		return 'Developer';
	}

	/**
	 * 버전 정보 가져오기
	 */
	static getVersion(directory: string = process.cwd()): string {
		const packageJson = this.readPackageJson(directory);
		return packageJson?.version || '1.0.0';
	}

	/**
	 * 설명 가져오기
	 */
	static getDescription(directory: string = process.cwd()): string {
		const packageJson = this.readPackageJson(directory);
		return packageJson?.description || '';
	}

	/**
	 * 캐시 초기화
	 */
	static clearCache(): void {
		this.packageJsonCache = {};
	}
}
