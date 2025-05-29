import { performance } from 'perf_hooks';
import { GenerationStats, FileGenerationResult } from './types';

/**
 * 성능 측정 및 최적화를 위한 유틸리티 클래스
 */
export class PerformanceUtils {
	private static timers: Map<string, number> = new Map();
	private static metrics: Map<string, number[]> = new Map();

	/**
	 * 타이머 시작
	 */
	static startTimer(name: string): void {
		this.timers.set(name, performance.now());
	}

	/**
	 * 타이머 종료 및 시간 반환
	 */
	static endTimer(name: string): number {
		const startTime = this.timers.get(name);
		if (!startTime) {
			console.warn(`타이머 '${name}'가 시작되지 않았습니다.`);
			return 0;
		}

		const endTime = performance.now();
		const duration = endTime - startTime;

		this.timers.delete(name);
		this.addMetric(name, duration);

		return duration;
	}

	/**
	 * 메트릭 추가
	 */
	static addMetric(name: string, value: number): void {
		if (!this.metrics.has(name)) {
			this.metrics.set(name, []);
		}
		this.metrics.get(name)!.push(value);
	}

	/**
	 * 메트릭 통계 계산
	 */
	static getMetricStats(name: string): {
		count: number;
		total: number;
		average: number;
		min: number;
		max: number;
	} | null {
		const values = this.metrics.get(name);
		if (!values || values.length === 0) {
			return null;
		}

		const total = values.reduce((sum, val) => sum + val, 0);
		const average = total / values.length;
		const min = Math.min(...values);
		const max = Math.max(...values);

		return {
			count: values.length,
			total,
			average,
			min,
			max
		};
	}

	/**
	 * 모든 성능 메트릭 출력
	 */
	static printMetrics(): void {
		console.log('\n⚡ 성능 메트릭:');

		if (this.metrics.size === 0) {
			console.log('   측정된 메트릭이 없습니다.');
			return;
		}

		for (const [name, values] of this.metrics.entries()) {
			const stats = this.getMetricStats(name);
			if (stats) {
				console.log(`   ${name}:`);
				console.log(`     실행 횟수: ${stats.count}`);
				console.log(`     총 시간: ${stats.total.toFixed(2)}ms`);
				console.log(`     평균 시간: ${stats.average.toFixed(2)}ms`);
				console.log(`     최소 시간: ${stats.min.toFixed(2)}ms`);
				console.log(`     최대 시간: ${stats.max.toFixed(2)}ms`);
			}
		}
	}

	/**
	 * 메트릭 초기화
	 */
	static clearMetrics(): void {
		this.timers.clear();
		this.metrics.clear();
	}

	/**
	 * 메모리 사용량 체크
	 */
	static getMemoryUsage(): NodeJS.MemoryUsage {
		return process.memoryUsage();
	}

	/**
	 * 메모리 사용량 출력
	 */
	static printMemoryUsage(): void {
		const memory = this.getMemoryUsage();

		console.log('\n💾 메모리 사용량:');
		console.log(`   RSS (Resident Set Size): ${this.formatBytes(memory.rss)}`);
		console.log(`   Heap Total: ${this.formatBytes(memory.heapTotal)}`);
		console.log(`   Heap Used: ${this.formatBytes(memory.heapUsed)}`);
		console.log(`   External: ${this.formatBytes(memory.external)}`);
	}

	/**
	 * 바이트를 읽기 쉬운 형태로 변환
	 */
	static formatBytes(bytes: number): string {
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		if (bytes === 0) return '0 Bytes';

		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
	}

	/**
	 * 함수 실행 시간 측정 (데코레이터 스타일)
	 */
	static measureTime<T extends (...args: any[]) => any>(
		fn: T,
		name?: string
	): T {
		const functionName = name || fn.name || 'anonymous';

		return ((...args: any[]) => {
			this.startTimer(functionName);
			const result = fn(...args);

			if (result instanceof Promise) {
				return result.finally(() => {
					this.endTimer(functionName);
				});
			} else {
				this.endTimer(functionName);
				return result;
			}
		}) as T;
	}

	/**
	 * 배치 처리 최적화
	 */
	static async processBatch<T, R>(
		items: T[],
		processor: (item: T) => Promise<R>,
		batchSize: number = 10,
		concurrency: number = 3
	): Promise<R[]> {
		const results: R[] = [];

		for (let i = 0; i < items.length; i += batchSize) {
			const batch = items.slice(i, i + batchSize);

			// 동시 실행 제한
			const promises = batch.slice(0, concurrency).map(processor);
			const batchResults = await Promise.all(promises);

			results.push(...batchResults);
		}

		return results;
	}

	/**
	 * 생성 통계에 성능 정보 추가
	 */
	static enhanceStats(
		stats: GenerationStats,
		duration: number
	): GenerationStats & {
		performanceMetrics: {
			totalDuration: number;
			averageFileTime: number;
			filesPerSecond: number;
		};
	} {
		const averageFileTime =
			stats.totalFiles > 0 ? duration / stats.totalFiles : 0;
		const filesPerSecond =
			duration > 0 ? (stats.totalFiles / duration) * 1000 : 0;

		return {
			...stats,
			performanceMetrics: {
				totalDuration: duration,
				averageFileTime,
				filesPerSecond
			}
		};
	}

	/**
	 * 파일 생성 결과 최적화 (중복 제거)
	 */
	static optimizeResults(
		results: FileGenerationResult[]
	): FileGenerationResult[] {
		const seen = new Set<string>();
		return results.filter((result) => {
			if (seen.has(result.path)) {
				return false;
			}
			seen.add(result.path);
			return true;
		});
	}

	/**
	 * 대용량 데이터 청크 처리
	 */
	static *chunkArray<T>(
		array: T[],
		chunkSize: number
	): Generator<T[], void, unknown> {
		for (let i = 0; i < array.length; i += chunkSize) {
			yield array.slice(i, i + chunkSize);
		}
	}

	/**
	 * 간단한 캐시 구현
	 */
	static createCache<K, V>(
		maxSize: number = 100
	): {
		get: (key: K) => V | undefined;
		set: (key: K, value: V) => void;
		clear: () => void;
		size: () => number;
	} {
		const cache = new Map<K, V>();

		return {
			get: (key: K) => cache.get(key),
			set: (key: K, value: V) => {
				if (cache.size >= maxSize) {
					const firstKey = cache.keys().next().value;
					if (firstKey !== undefined) {
						cache.delete(firstKey);
					}
				}
				cache.set(key, value);
			},
			clear: () => cache.clear(),
			size: () => cache.size
		};
	}
}
