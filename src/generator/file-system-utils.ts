import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { DirectoryConfig, FileGenerationResult } from './types';

/**
 * 파일 시스템 작업을 담당하는 유틸리티 클래스
 */
export class FileSystemUtils {
	/**
	 * 디렉토리 구조 생성
	 */
	static createDirectories(
		baseDir: string,
		directories: DirectoryConfig[]
	): void {
		console.log('📁 디렉토리 구조를 생성합니다...');

		for (const dir of directories) {
			const dirPath = path.join(baseDir, dir.path);

			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true });
				console.log(`   ✓ ${dir.path}/`);
			} else {
				console.log(`   - ${dir.path}/ (이미 존재함)`);
			}
		}
	}

	/**
	 * 디렉토리가 존재하는지 확인하고 생성
	 */
	static ensureDirectoryExists(dirPath: string): void {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}

	/**
	 * 파일이 존재하는지 확인
	 */
	static fileExists(filePath: string): boolean {
		return fs.existsSync(filePath);
	}

	/**
	 * YAML 파일로 저장
	 */
	static saveYamlFile(
		content: any,
		outputPath: string,
		overwrite: boolean = false
	): FileGenerationResult {
		try {
			// 파일이 이미 존재하고 덮어쓰기가 비활성화된 경우
			if (this.fileExists(outputPath) && !overwrite) {
				console.log(`   - ${outputPath} (이미 존재함)`);
				return {
					path: outputPath,
					success: true,
					skipped: true
				};
			}

			// 출력 디렉토리 생성
			const outputDir = path.dirname(outputPath);
			this.ensureDirectoryExists(outputDir);

			// YAML로 변환하여 파일 저장
			const yamlContent = yaml.dump(content, {
				indent: 2,
				lineWidth: -1,
				noRefs: true
			});

			fs.writeFileSync(outputPath, yamlContent, 'utf8');
			console.log(`   ✓ ${outputPath}`);

			return {
				path: outputPath,
				success: true,
				skipped: false
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(`   ✗ ${outputPath} - 오류: ${errorMessage}`);

			return {
				path: outputPath,
				success: false,
				skipped: false,
				error: errorMessage
			};
		}
	}

	/**
	 * 텍스트 파일로 저장
	 */
	static saveTextFile(
		content: string,
		outputPath: string,
		overwrite: boolean = false
	): FileGenerationResult {
		try {
			// 파일이 이미 존재하고 덮어쓰기가 비활성화된 경우
			if (this.fileExists(outputPath) && !overwrite) {
				console.log(`   - ${outputPath} (이미 존재함)`);
				return {
					path: outputPath,
					success: true,
					skipped: true
				};
			}

			// 출력 디렉토리 생성
			const outputDir = path.dirname(outputPath);
			this.ensureDirectoryExists(outputDir);

			// 파일 저장
			fs.writeFileSync(outputPath, content, 'utf8');
			console.log(`   ✓ ${outputPath}`);

			return {
				path: outputPath,
				success: true,
				skipped: false
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(`   ✗ ${outputPath} - 오류: ${errorMessage}`);

			return {
				path: outputPath,
				success: false,
				skipped: false,
				error: errorMessage
			};
		}
	}

	/**
	 * 파일 읽기
	 */
	static readFile(filePath: string): string {
		if (!this.fileExists(filePath)) {
			throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
		}
		return fs.readFileSync(filePath, 'utf8');
	}

	/**
	 * 디렉토리 내 파일 목록 조회
	 */
	static listFiles(dirPath: string, extension?: string): string[] {
		if (!fs.existsSync(dirPath)) {
			return [];
		}

		const files = fs.readdirSync(dirPath);

		if (extension) {
			return files.filter((file) => file.endsWith(extension));
		}

		return files;
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
