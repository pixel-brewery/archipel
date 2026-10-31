import { describe, expect, it, vi } from 'vitest';
import type { MetricsService } from '../otel/MetricsService.js';
import type { ITelemetryOptions } from '../options/TelemetryOptions.js';
import { TelemetryRuleEngine } from './TelemetryRuleEngine.js';

describe('TelemetryRuleEngine', () => {
    const options: ITelemetryOptions = {
        enabled: true,
        serviceName: 'test',
        pattern: { enableCacheMetrics: true, enableOperationMetrics: true },
    };

    it('forwards cache and operation logs through the OpenTelemetry metrics service', () => {
        const recordCounter = vi.fn();
        const recordHistogram = vi.fn();
        const metrics = { recordCounter, recordHistogram } as unknown as MetricsService;
        const engine = new TelemetryRuleEngine(options, metrics);

        engine.process('cache.event cache=products outcome=hit');
        engine.process('op.success name=getUser duration_ms=42');

        expect(recordCounter).toHaveBeenCalledWith('cache_event_total', 1, { cache: 'products', outcome: 'hit', phase: 'none' });
        expect(recordCounter).toHaveBeenCalledWith('operation_event_total', 1, { name: 'getUser', status: 'success' });
        expect(recordHistogram).toHaveBeenCalledWith('operation_duration_ms', 42, { name: 'getUser', status: 'success' });
    });

    it('preserves client metric value and gauge semantics', () => {
        const recordCounter = vi.fn();
        const recordGauge = vi.fn();
        const metrics = { recordCounter, recordGauge } as unknown as MetricsService;
        const engine = new TelemetryRuleEngine(options, metrics);

        engine.process('client.metric name=click type=counter value=5');
        engine.process('client.metric name=queue type=gauge value=2');

        expect(recordCounter).toHaveBeenCalledWith('client_metric_total', 5, { source: 'client', name: 'click' });
        expect(recordGauge).toHaveBeenCalledWith('client_metric_gauge', 2, { source: 'client', name: 'queue' });
    });

    it('honours disabled pattern options', () => {
        const recordCounter = vi.fn();
        const metrics = { recordCounter } as unknown as MetricsService;
        const engine = new TelemetryRuleEngine({ ...options, pattern: { enableCacheMetrics: false, enableOperationMetrics: false } }, metrics);

        engine.process('cache.event cache=products outcome=hit');
        engine.process('op.error name=getUser duration_ms=9');

        expect(recordCounter).not.toHaveBeenCalled();
    });

    it('keeps logging available when no metric strategy is registered', () => {
        const engine = new TelemetryRuleEngine(options);

        expect(() => engine.process('cache.event cache=products outcome=hit')).not.toThrow();
        expect(() => engine.process('op.success name=getUser duration_ms=42')).not.toThrow();
        expect(() => engine.process('client.metric name=click type=counter value=5')).not.toThrow();
    });

    it('does not translate log messages when telemetry is disabled', () => {
        const recordCounter = vi.fn();
        const metrics = { recordCounter } as unknown as MetricsService;
        const engine = new TelemetryRuleEngine({ ...options, enabled: false }, metrics);

        engine.process('cache.event cache=products outcome=hit');

        expect(recordCounter).not.toHaveBeenCalled();
    });
});
