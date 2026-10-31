import { afterEach, describe, expect, it, vi } from 'vitest';
import { VercelMeasurementSink } from './VercelMeasurementSink.js';

const sendMetric = vi.hoisted(() => vi.fn());
vi.mock('@vercel/functions', () => ({ metric: sendMetric }));

describe('VercelMeasurementSink', () => {
    afterEach(() => vi.restoreAllMocks());

    it('sends each observation with stable attributes to Vercel', () => {
        const client = new VercelMeasurementSink();
        client.record('http_requests_total', 1, { method: 'GET', status: '200' });

        expect(sendMetric).toHaveBeenCalledWith('http_requests_total', 1, { method: 'GET', status: '200' });
    });

    it('rejects metrics exceeding Vercel limits', () => {
        const client = new VercelMeasurementSink();

        expect(() => client.record('x'.repeat(64), 1, {})).toThrow();
    });

    it('keeps long route attributes stable and within Vercel limits', () => {
        const client = new VercelMeasurementSink();
        const path = `/api/${'long-segment/'.repeat(8)}:id`;

        client.record('http_requests_total', 1, { path });

        const tags = sendMetric.mock.lastCall?.[2] as Record<string, string>;
        expect(tags['path']?.length).toBeLessThan(64);
        expect(tags['path']).toMatch(/^\/api\//);
    });
});
