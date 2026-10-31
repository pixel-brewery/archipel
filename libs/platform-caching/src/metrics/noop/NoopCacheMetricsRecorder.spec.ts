import { describe, expect, it } from 'vitest';
import { NoopCacheMetricsRecorder } from './NoopCacheMetricsRecorder.js';

describe('NoopCacheMetricsRecorder', () => {
    it('should not throw when recording a cache hit', () => {
        // arrange
        const recorder = new NoopCacheMetricsRecorder();

        // act & assert
        expect(() => recorder.recordHit('test-cache')).not.toThrow();
    });

    it('should not throw when recording a cache miss', () => {
        // arrange
        const recorder = new NoopCacheMetricsRecorder();

        // act & assert
        expect(() => recorder.recordMiss('test-cache')).not.toThrow();
    });

    it('should not throw when recording a successful load', () => {
        // arrange
        const recorder = new NoopCacheMetricsRecorder();

        // act & assert
        expect(() => recorder.recordLoadSuccess('test-cache')).not.toThrow();
    });

    it('should not throw when recording a failed load', () => {
        // arrange
        const recorder = new NoopCacheMetricsRecorder();

        // act & assert
        expect(() => recorder.recordLoadError('test-cache')).not.toThrow();
    });

    it('should not throw when recording an eviction', () => {
        // arrange
        const recorder = new NoopCacheMetricsRecorder();

        // act & assert
        expect(() => recorder.recordEviction?.('test-cache')).not.toThrow();
    });

    it('should implement ICacheMetricsRecorder interface', () => {
        // arrange
        const recorder = new NoopCacheMetricsRecorder();

        // act & assert
        expect(recorder.recordHit).toBeDefined();
        expect(recorder.recordMiss).toBeDefined();
        expect(recorder.recordLoadSuccess).toBeDefined();
        expect(recorder.recordLoadError).toBeDefined();
        expect(recorder.recordEviction).toBeDefined();
    });
});
