import { describe, expect, it } from 'vitest';
import { OtelMetricClient } from './OtelMetricClient.js';

describe('OtelMetricClient', () => {
    it('records through the OpenTelemetry API after initialization', async () => {
        const client = new OtelMetricClient();

        expect(() => client.record('counter', 'orders_total', 1, { channel: 'web' })).toThrow('not initialized');
        expect(client.getInstruments()).toBeUndefined();

        await client.initialize();

        expect(client.getInstruments()).toEqual({
            cacheCounter: expect.any(Object),
            opCounter: expect.any(Object),
            opDuration: expect.any(Object),
        });
        expect(() => client.record('counter', 'orders_total', 1, { channel: 'web' })).not.toThrow();
        expect(() => client.record('gauge', 'orders_total', 2, { channel: 'web' })).toThrow('another type');
    });
});
