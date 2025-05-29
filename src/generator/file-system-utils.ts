import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DirectoryConfig, FileGenerationResult } from './types';

/**
 * 파일 시스템 관련 유틸리티 함수들
 */
export class FileSystemUtils {
	/**
	 * 파일 또는 디렉토리가 존재하는지 확인
	 */
	static fileExists(filePath: string): boolean {
		try {
			return fs.existsSync(filePath);
		} catch {
			return false;
		}
	}

	/**
	 * 디렉토리를 재귀적으로 생성
	 */
	static ensureDirectoryExists(dirPath: string): void {
		if (!this.fileExists(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}

	/**
	 * 파일 내용을 읽어옴
	 */
	static readFile(filePath: string): string {
		try {
			return fs.readFileSync(filePath, 'utf-8');
		} catch (error) {
			throw new Error(`파일 읽기 실패: ${filePath} - ${error}`);
		}
	}

	/**
	 * YAML 콘텐츠를 파일로 저장
	 */
	static writeYamlFile(
		filePath: string,
		content: Record<string, unknown>,
		overwrite: boolean = false
	): FileGenerationResult {
		try {
			// 파일이 이미 존재하고 덮어쓰기가 허용되지 않은 경우
			if (this.fileExists(filePath) && !overwrite) {
				return {
					path: filePath,
					success: true,
					skipped: true
				};
			}

			// 디렉토리 생성
			const dirPath = path.dirname(filePath);
			this.ensureDirectoryExists(dirPath);

			// YAML 문자열로 변환하여 저장
			const yamlContent = yaml.dump(content, {
				indent: 2,
				lineWidth: 120,
				noRefs: true,
				quotingType: '"',
				forceQuotes: false
			});

			fs.writeFileSync(filePath, yamlContent, 'utf-8');

			return {
				path: filePath,
				success: true,
				skipped: false
			};
		} catch (error) {
			return {
				path: filePath,
				success: false,
				skipped: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * 일반 텍스트 파일 저장
	 */
	static writeTextFile(
		filePath: string,
		content: string,
		overwrite: boolean = false
	): FileGenerationResult {
		try {
			// 파일이 이미 존재하고 덮어쓰기가 허용되지 않은 경우
			if (this.fileExists(filePath) && !overwrite) {
				return {
					path: filePath,
					success: true,
					skipped: true
				};
			}

			// 디렉토리 생성
			const dirPath = path.dirname(filePath);
			this.ensureDirectoryExists(dirPath);

			fs.writeFileSync(filePath, content, 'utf-8');

			return {
				path: filePath,
				success: true,
				skipped: false
			};
		} catch (error) {
			return {
				path: filePath,
				success: false,
				skipped: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	/**
	 * 디렉토리 구조 생성
	 */
	static createDirectoryStructure(
		baseDir: string,
		directories: DirectoryConfig[]
	): void {
		for (const dir of directories) {
			const fullPath = path.join(baseDir, dir.path);
			this.ensureDirectoryExists(fullPath);
		}
	}

	/**
	 * 파일 목록 조회
	 */
	static listFiles(dirPath: string, extension?: string): string[] {
		try {
			if (!this.fileExists(dirPath)) {
				return [];
			}

			const files = fs.readdirSync(dirPath);

			if (extension) {
				return files.filter((file) => file.endsWith(extension));
			}

			return files;
		} catch {
			return [];
		}
	}

	/**
	 * 파일 크기 조회
	 */
	static getFileSize(filePath: string): number {
		try {
			const stats = fs.statSync(filePath);
			return stats.size;
		} catch {
			return 0;
		}
	}

	/**
	 * 파일 수정 시간 조회
	 */
	static getFileModifiedTime(filePath: string): Date | null {
		try {
			const stats = fs.statSync(filePath);
			return stats.mtime;
		} catch {
			return null;
		}
	}

	/**
	 * 안전한 파일 삭제
	 */
	static deleteFile(filePath: string): boolean {
		try {
			if (this.fileExists(filePath)) {
				fs.unlinkSync(filePath);
				return true;
			}
			return false;
		} catch {
			return false;
		}
	}

	/**
	 * 디렉토리 내용 조회 (재귀적)
	 */
	static listDirectoryContents(
		dirPath: string,
		recursive: boolean = false
	): {
		files: string[];
		directories: string[];
	} {
		const result: { files: string[]; directories: string[] } = {
			files: [],
			directories: []
		};

		try {
			if (!this.fileExists(dirPath)) {
				return result;
			}

			const items = fs.readdirSync(dirPath);

			for (const item of items) {
				const itemPath = path.join(dirPath, item);
				const stats = fs.statSync(itemPath);

				if (stats.isDirectory()) {
					result.directories.push(itemPath);

					if (recursive) {
						const subContents = this.listDirectoryContents(itemPath, true);
						result.files.push(...subContents.files);
						result.directories.push(...subContents.directories);
					}
				} else {
					result.files.push(itemPath);
				}
			}
		} catch {
			// 오류 발생 시 빈 결과 반환
		}

		return result;
	}

	/**
	 * 하위 호환성을 위한 메서드들
	 */

	/**
	 * @deprecated writeYamlFile을 사용하세요
	 */
	static saveYamlFile(
		content: Record<string, unknown>,
		outputPath: string,
		overwrite: boolean = false
	): FileGenerationResult {
		return this.writeYamlFile(outputPath, content, overwrite);
	}

	/**
	 * @deprecated createDirectoryStructure를 사용하세요
	 */
	static createDirectories(
		baseDir: string,
		directories: DirectoryConfig[]
	): void {
		console.log('📁 디렉토리 구조를 생성합니다...');
		this.createDirectoryStructure(baseDir, directories);
	}

	/**
	 * 출력 경로 생성
	 */
	static createOutputPath(
		baseDir: string,
		subdirectory: string,
		filename: string
	): string {
		return path.join(baseDir, subdirectory, filename);
	}
}
