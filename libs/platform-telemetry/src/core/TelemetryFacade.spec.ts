import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TelemetryFacade } from './TelemetryFacade.js';
import type { MetricsService } from '../otel/MetricsService.js';

describe('TelemetryFacade', () => {
    // #region Fields

    let facade: TelemetryFacade;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        facade = new TelemetryFacade();
    });

    it('should execute operation and return result', async () => {
        // act
        const result = await facade.runOperation('test-op', () => 42);

        // assert
        expect(result).toBe(42);
    });

    it('should execute async operation and return result', async () => {
        // act
        const result = await facade.runOperation('async-op', async () => 'hello');

        // assert
        expect(result).toBe('hello');
    });

    it('should rethrow errors from failed operations', async () => {
        // arrange
        const error = new Error('boom');

        // act & assert
        await expect(
            facade.runOperation('fail-op', () => {
                throw error;
            }),
        ).rejects.toThrow('boom');
    });

    it('should record cache events without throwing', () => {
        // act & assert - no error
        expect(() =>
            facade.recordCacheEvent({
                cache: 'test-cache',
                outcome: 'hit',
            }),
        ).not.toThrow();
    });

    it('should record cache events with phase', () => {
        // act & assert - no error
        expect(() =>
            facade.recordCacheEvent({
                cache: 'test-cache',
                outcome: 'load_success',
                phase: 'load',
            }),
        ).not.toThrow();
    });

    it('should record client metrics without throwing', () => {
        // act & assert - no error
        expect(() => facade.recordClientMetric('click_count', 'counter', 1)).not.toThrow();
    });

    it('should record client metrics with labels', () => {
        // act & assert - no error
        expect(() => facade.recordClientMetric('duration', 'histogram', 150, { page: 'home' })).not.toThrow();
    });

    it('should return a Logger instance', () => {
        // act
        const logger = facade.getLogger();

        // assert
        expect(logger).toBeDefined();
    });

    it('records facade operations and client gauges through the shared metrics service', async () => {
        const recordCounter = vi.fn();
        const recordHistogram = vi.fn();
        const recordGauge = vi.fn();
        const metrics = { recordCounter, recordHistogram, recordGauge } as unknown as MetricsService;
        const instrumented = new TelemetryFacade(undefined, metrics);

        await instrumented.runOperation('checkout', () => true);
        instrumented.recordClientMetric('queue_depth', 'gauge', 3, { queue: 'mail' });

        expect(recordCounter).toHaveBeenCalledWith('operation_event_total', 1, { name: 'checkout', status: 'success' });
        expect(recordHistogram).toHaveBeenCalledWith('operation_duration_ms', expect.any(Number), { name: 'checkout', status: 'success' });
        expect(recordGauge).toHaveBeenCalledWith('queue_depth', 3, { queue: 'mail' });
    });

    it('respects disabled cache and operation metric patterns', async () => {
        const recordCounter = vi.fn();
        const metrics = { recordCounter } as unknown as MetricsService;
        const instrumented = new TelemetryFacade(undefined, metrics, {
            enableCacheMetrics: false,
            enableOperationMetrics: false,
        });

        await instrumented.runOperation('ignored', () => true);
        instrumented.recordCacheEvent({ cache: 'ignored', outcome: 'hit' });

        expect(recordCounter).not.toHaveBeenCalled();
    });

    // #endregion
});
