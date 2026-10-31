import { describe, expect, it, vi } from 'vitest';
import type { OtelMetricClient } from './client/OtelMetricClient.js';
import { MetricsService } from './MetricsService.js';

describe('MetricsService', () => {
    it('records existing HTTP, outbound and cache contracts through one provider', () => {
        const record = vi.fn();
        const service = new MetricsService({ record } as unknown as OtelMetricClient);

        service.recordHttpRequest('GET', '/users/:id', '200', 42);
        service.recordExternalHttpRequest('graph', 'list', 'success', 17);
        service.setExternalHttpConsecutiveFailures('graph', 'list', 2);
        service.setCacheEntries('captions', 4);
        service.recordCacheEviction('captions');

        expect(record).toHaveBeenCalledWith('histogram', 'http_request_duration_ms', 42, { method: 'GET', path: '/users/:id', status: '200' });
        expect(record).toHaveBeenCalledWith('counter', 'external_http_request_total', 1, { service: 'graph', action: 'list', status: 'success' });
        expect(record).toHaveBeenCalledWith('gauge', 'external_http_consecutive_failures', 2, { service: 'graph', action: 'list' });
        expect(record).toHaveBeenCalledWith('gauge', 'application_cache_entries', 4, { cache: 'captions' });
        expect(record).toHaveBeenCalledWith('counter', 'application_cache_evictions_total', 1, { cache: 'captions' });
    });

    it('keeps telemetry failures and invalid counter values out of business operations', () => {
        const record = vi.fn().mockImplementation(() => {
            throw new Error('provider unavailable');
        });
        const service = new MetricsService({ record } as unknown as OtelMetricClient);

        expect(() => service.recordCounter('requests_total', -1)).not.toThrow();
        expect(() => service.recordCounter('requests_total', 1)).not.toThrow();
        expect(record).toHaveBeenCalledTimes(1);
    });
});
