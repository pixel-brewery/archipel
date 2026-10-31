// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Logger, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NEW_RELIC_LICENSE_KEY } from './env.js';
import { NewRelicMeasurementSink } from './NewRelicMeasurementSink.js';
import { NEW_RELIC_MEASUREMENT_OPTIONS } from './NewRelicMeasurementToken.js';
import { MeasurementsModule } from '../../MeasurementsModule.js';
import { MeasurementsService } from '../../MeasurementsService.js';
import { gunzipSync } from 'node:zlib';

// #endregion

const retain = vi.fn();

class TestConfigurationModule {}
Module({})(TestConfigurationModule);

describe('NewRelicMeasurementSink', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        retain.mockClear();
    });

    it('composes the public sink with imported configuration, explicit US routing and a bounded shutdown drain', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
        const moduleRef = await Test.createTestingModule({
            imports: [
                MeasurementsModule.register({
                    sink: NewRelicMeasurementSink,
                    imports: [
                        {
                            module: TestConfigurationModule,
                            providers: [{ provide: ConfigService, useValue: { tryGet: () => 'test-license-key' } }],
                            exports: [ConfigService],
                        },
                    ],
                    providers: [
                        {
                            provide: NEW_RELIC_MEASUREMENT_OPTIONS,
                            useValue: {
                                region: 'us',
                                attributes: { 'service.name': 'example-service' },
                                serviceVersion: 'build-123',
                            },
                        },
                    ],
                }),
            ],
        }).compile();
        await moduleRef.init();
        moduleRef.get(MeasurementsService).record('operational_failures_total', 1, { 'error.code': 'UNKNOWN' });
        await moduleRef.close();
        expect(fetchMock).toHaveBeenCalledWith('https://metric-api.newrelic.com/metric/v1', expect.any(Object));
        const log = fetchMock.mock.calls.find(([url]) => url === 'https://log-api.newrelic.com/log/v1');
        expect(JSON.parse(String(log?.[1]?.body))[0].common.attributes).toMatchObject({
            'service.name': 'example-service',
            'service.version': 'build-123',
        });
        moduleRef.get(NewRelicMeasurementSink).record('late_total', 1, {});
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('rejects an invalid region without sending credentials to a default endpoint', () => {
        const config = { tryGet: () => 'test-license-key' } as unknown as ConfigService;
        expect(
            () =>
                new NewRelicMeasurementSink(config, {
                    region: 'invalid' as 'eu',
                    attributes: {},
                }),
        ).toThrow('New Relic region must be eu or us.');
    });

    it('aborts a stalled export at shutdown without waiting for an unbounded network promise', async () => {
        vi.useFakeTimers();
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => undefined));
        try {
            const sink = createSink({ [NEW_RELIC_LICENSE_KEY.key]: 'test-license-key' });
            sink.record('requests_total', 1, {});
            await Promise.resolve();
            const closing = sink.onModuleDestroy();
            await vi.advanceTimersByTimeAsync(5000);
            await closing;
            expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps a failing host retention hook out of the measurement caller', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const sink = new NewRelicMeasurementSink({ tryGet: () => 'test-license-key' } as unknown as ConfigService, {
            region: 'eu',
            attributes: {},
            retain: () => {
                throw new Error('private host detail');
            },
        });
        expect(() => sink.record('requests_total', 1, {})).not.toThrow();
        await sink.onModuleDestroy();
        expect(warn).toHaveBeenCalledWith('Metric delivery could not join the host lifecycle.');
        expect(JSON.stringify(warn.mock.calls)).not.toContain('private host detail');
    });

    it('delivers counters, durations, and gauges to the New Relic EU account within the Function lifecycle', async () => {
        // arrange
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
        const sink = createSink({
            [NEW_RELIC_LICENSE_KEY.key]: 'test-only-license-key',
            runtime: 'serverless',
            stage: 'prev',
        });

        // act
        sink.record('http_requests_total', 1, { status: '200' });
        sink.record('http_request_duration_ms', 12.5, { status: '200' });
        sink.record('auth_sessions_active', 3, {});
        await retain.mock.lastCall?.[0];

        // assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, request] = fetchMock.mock.calls[0];
        expect(url).toBe('https://metric-api.eu.newrelic.com/metric/v1');
        expect(request?.headers).toMatchObject({ 'Api-Key': 'test-only-license-key' });
        expect(JSON.parse(String(request?.body))).toMatchObject([
            {
                common: { attributes: { 'service.name': 'example-api', 'deployment.environment': 'prev' } },
                metrics: [
                    { name: 'http_requests_total', type: 'count', value: 1, 'interval.ms': 1 },
                    {
                        name: 'http_request_duration_ms',
                        type: 'summary',
                        value: { count: 1, sum: 12.5, min: 12.5, max: 12.5 },
                        'interval.ms': 1,
                    },
                    { name: 'auth_sessions_active', type: 'gauge', value: 3 },
                ],
            },
        ]);
        expect(retain).toHaveBeenCalledTimes(3);
    });

    it('does not send local measurements without a license key', async () => {
        // arrange
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
        const sink = createSink({ runtime: 'local' });

        // act
        sink.record('auth_logins_total', 1, {});
        await Promise.resolve();

        // assert
        expect(fetchMock).not.toHaveBeenCalled();
        expect(retain).not.toHaveBeenCalled();
    });

    it('preserves individual durations for percentiles and excludes gauges, counters and correlation identifiers', async () => {
        // arrange
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));
        const sink = new NewRelicMeasurementSink({ tryGet: () => 'test-license-key' } as unknown as ConfigService, {
            region: 'eu',
            attributes: { 'service.name': 'example-api', 'deployment.environment': 'dev' },
            serviceVersion: 'build-123',
            durationEvents: true,
            retain,
        });

        // act
        for (const duration of [1, 2, 500]) {
            sink.record('http_request_duration_ms', duration, { path: '/items/:id', 'request.id': 'private-correlation' });
        }
        sink.record('http_requests_total', 3, {});
        sink.record('connections', 5, {});
        await retain.mock.lastCall?.[0];

        // assert
        const eventRequest = fetchMock.mock.calls.find(([url]) => String(url).includes('insights-collector'))?.[1];
        expect(fetchMock).toHaveBeenCalledWith('https://insights-collector.eu01.nr-data.net/v1/accounts/events', expect.any(Object));
        expect(eventRequest?.headers).toMatchObject({ 'Content-Encoding': 'gzip' });
        expect(eventRequest?.body).toBeInstanceOf(Uint8Array);
        const events = JSON.parse(gunzipSync(eventRequest?.body as Uint8Array).toString('utf8'));
        expect(events).toHaveLength(3);
        expect(events.map((event: { durationMs: number }) => event.durationMs)).toEqual([1, 2, 500]);
        expect(events[2]).toMatchObject({
            eventType: 'MeasurementDuration',
            'measurement.name': 'http_request_duration_ms',
            'service.name': 'example-api',
            'service.version': 'build-123',
            path: '/items/:id',
        });
        expect(JSON.stringify(events)).not.toContain('private-correlation');
    });

    it('continues metric delivery when duration event ingestion rejects the payload', async () => {
        // arrange
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(async (url) => new Response(null, { status: String(url).includes('insights-collector') ? 403 : 202 }));
        const sink = new NewRelicMeasurementSink({ tryGet: () => 'private-license-key' } as unknown as ConfigService, {
            region: 'us',
            attributes: {},
            durationEvents: true,
            retain,
        });

        // act
        sink.record('query_duration_ms', 20, {});
        await retain.mock.lastCall?.[0];

        // assert
        expect(fetchMock).toHaveBeenCalledWith('https://metric-api.newrelic.com/metric/v1', expect.any(Object));
        expect(fetchMock).toHaveBeenCalledWith('https://insights-collector.newrelic.com/v1/accounts/events', expect.any(Object));
        expect(warn).toHaveBeenCalledWith('New Relic event delivery returned HTTP 403.');
        expect(JSON.stringify(warn.mock.calls)).not.toContain('private-license-key');
    });

    it('exports a sanitized operational failure as both a count and a correlated log, without metric ID cardinality', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
        const sink = createSink({ [NEW_RELIC_LICENSE_KEY.key]: 'test-only-license-key', runtime: 'serverless' });
        sink.record('operational_failures_total', 1, {
            component: 'scheduled_job',
            job: 'nightly-task',
            'error.code': 'P2028',
            'cause.code': 'P2028',
            'failure.kind': 'transaction_closed',
            'request.id': 'server-generated-correlation',
        });
        await retain.mock.lastCall?.[0];
        const metric = fetchMock.mock.calls.find(([url]) => String(url).includes('metric-api'));
        const log = fetchMock.mock.calls.find(([url]) => String(url).includes('log-api'));
        expect(String(metric?.[1]?.body)).not.toContain('server-generated-correlation');
        expect(JSON.parse(String(log?.[1]?.body))).toMatchObject([
            {
                common: { attributes: { logtype: 'operational_failure', 'deployment.environment': 'dev' } },
                logs: [
                    {
                        message: 'Operational failure',
                        attributes: {
                            'error.code': 'P2028',
                            'request.id': 'server-generated-correlation',
                            level: 'ERROR',
                        },
                    },
                ],
            },
        ]);
        expect(log?.[0]).toBe('https://log-api.eu.newrelic.com/log/v1');
    });

    it('still delivers error logs when metric ingestion fails', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
            if (String(url).includes('metric-api')) throw new Error('private credential');
            return new Response(null, { status: 202 });
        });
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const sink = createSink({ [NEW_RELIC_LICENSE_KEY.key]: 'test-only-license-key', runtime: 'serverless' });
        sink.record('operational_failures_total', 1, { 'error.code': 'P0001' });
        await retain.mock.lastCall?.[0];
        expect(fetchMock).toHaveBeenCalledWith('https://log-api.eu.newrelic.com/log/v1', expect.any(Object));
        expect(warn.mock.calls.flat().join(' ')).not.toContain('private credential');
    });

    it('bounds a burst of measurements, retains the operational failure and reports dropped values', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 202 }));
        vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const sink = createSink({ [NEW_RELIC_LICENSE_KEY.key]: 'test-only-license-key', runtime: 'serverless' });
        for (let index = 0; index < 510; index++) sink.record('http_requests_total', 1, {});
        sink.record('operational_failures_total', 1, { 'error.code': 'P2028' });
        await retain.mock.lastCall?.[0];
        const metric = fetchMock.mock.calls.find(([url]) => String(url).includes('metric-api'));
        const payload = JSON.parse(String(metric?.[1]?.body));
        expect(payload[0].metrics).toHaveLength(501);
        expect(payload[0].metrics).toContainEqual(expect.objectContaining({ name: 'telemetry_dropped_total', value: 11 }));
        expect(fetchMock).toHaveBeenCalledWith('https://log-api.eu.newrelic.com/log/v1', expect.any(Object));
    });

    it('reports a rejected ingest response without exposing the license key', async () => {
        // arrange
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 403 }));
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const sink = createSink({
            [NEW_RELIC_LICENSE_KEY.key]: 'test-only-license-key',
            runtime: 'serverless',
        });

        // act
        sink.record('auth_logins_total', 1, {});
        await retain.mock.lastCall?.[0];

        // assert
        expect(warn).toHaveBeenCalledWith('New Relic metric delivery returned HTTP 403.');
        expect(warn.mock.calls.flat().join(' ')).not.toContain('test-only-license-key');
    });

    it('keeps an ingest network failure out of the business request and its logs free of the license key', async () => {
        // arrange
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('test-only-license-key'));
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const sink = createSink({
            [NEW_RELIC_LICENSE_KEY.key]: 'test-only-license-key',
            runtime: 'serverless',
        });

        // act
        sink.record('auth_logins_total', 1, {});
        await retain.mock.lastCall?.[0];

        // assert
        expect(warn).toHaveBeenCalledWith('New Relic metric delivery failed.');
        expect(warn.mock.calls.flat().join(' ')).not.toContain('test-only-license-key');
    });
});

function createSink(values: Readonly<Record<string, string>>): NewRelicMeasurementSink {
    const config = {
        tryGet: vi.fn((key: string, fallback: string): string => values[key] ?? fallback),
    };
    return new NewRelicMeasurementSink(config as unknown as ConfigService, {
        region: 'eu',
        attributes: { 'service.name': 'example-api', 'deployment.environment': values['stage'] ?? 'dev' },
        ...(values['runtime'] === 'serverless' ? { retain } : {}),
    });
}
