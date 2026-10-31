import { describe, expect, it } from 'vitest';
import { NoopMeasurementSink } from './NoopMeasurementSink.js';

describe('NoopMeasurementSink', () => {
    it('accepts observations without emitting metrics', () => {
        const client = new NoopMeasurementSink();

        expect(() => client.record('orders_total', 1, { channel: 'web' })).not.toThrow();
    });
});
