import { describe, expect, it } from 'vitest';
import { NoopTelemetryFacade } from './NoopTelemetryFacade.js';

describe('NoopTelemetryFacade', () => {
    it('returns operation result unchanged', async () => {
        const facade = new NoopTelemetryFacade();
        const result = await facade.runOperation('operation', async () => 'ok');
        expect(result).toBe('ok');
    });

    it('supports optional metric methods without throwing', () => {
        const facade = new NoopTelemetryFacade();
        expect(() => facade.recordCacheEvent?.({ cache: 'memory', outcome: 'hit' })).not.toThrow();
        expect(() => facade.recordClientMetric?.('requests', 'counter', 1, { endpoint: '/health' })).not.toThrow();
    });
});
