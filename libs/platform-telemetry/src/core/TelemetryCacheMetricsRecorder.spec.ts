import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ITelemetryFacade } from './NoopTelemetryFacade.js';
import { TelemetryCacheMetricsRecorder } from './TelemetryCacheMetricsRecorder.js';

describe('TelemetryCacheMetricsRecorder', () => {
    // #region Fields

    let recorder: TelemetryCacheMetricsRecorder;
    let facadeMock: ITelemetryFacade;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        facadeMock = {
            runOperation: vi.fn(),
            recordCacheEvent: vi.fn(),
            recordClientMetric: vi.fn(),
        };

        recorder = new TelemetryCacheMetricsRecorder(facadeMock);
    });

    it('should record a cache hit', () => {
        // act
        recorder.recordHit('products');

        // assert
        expect(facadeMock.recordCacheEvent).toHaveBeenCalledWith({
            cache: 'products',
            outcome: 'hit',
        });
    });

    it('should record a cache miss', () => {
        // act
        recorder.recordMiss('products');

        // assert
        expect(facadeMock.recordCacheEvent).toHaveBeenCalledWith({
            cache: 'products',
            outcome: 'miss',
        });
    });

    it('should record a load success', () => {
        // act
        recorder.recordLoadSuccess('products');

        // assert
        expect(facadeMock.recordCacheEvent).toHaveBeenCalledWith({
            cache: 'products',
            outcome: 'load_success',
            phase: 'load',
        });
    });

    it('should record a load error', () => {
        // act
        recorder.recordLoadError('products');

        // assert
        expect(facadeMock.recordCacheEvent).toHaveBeenCalledWith({
            cache: 'products',
            outcome: 'load_error',
            phase: 'load',
        });
    });

    it('should record an eviction', () => {
        // act
        recorder.recordEviction('products');

        // assert
        expect(facadeMock.recordCacheEvent).toHaveBeenCalledWith({
            cache: 'products',
            outcome: 'eviction',
            phase: 'evict',
        });
    });

    // #endregion
});
