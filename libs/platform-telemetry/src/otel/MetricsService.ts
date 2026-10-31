import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { OtelMetricClient } from './client/OtelMetricClient.js';
import type { IMetricInstruments } from './MetricInstruments.js';
import type { MetricKind } from './MetricKind.js';

/** Records application metrics through OpenTelemetry instruments. */
@Injectable()
export class MetricsService implements OnModuleInit {
    // #region Fields

    private readonly _logger = new Logger(MetricsService.name);
    private readonly _client: OtelMetricClient;

    // #endregion

    // #region Ctor

    public constructor(client: OtelMetricClient) {
        this._client = client;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public async onModuleInit(): Promise<void> {
        try {
            await this._client.initialize();
        } catch (error: unknown) {
            this._logger.warn(`OpenTelemetry instruments could not initialize: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public getInstruments(): IMetricInstruments | undefined {
        return this._client.getInstruments();
    }

    public recordCounter(name: string, value = 1, attributes: Readonly<Record<string, string>> = {}): void {
        this.record('counter', name, value, attributes);
    }

    public recordHistogram(name: string, value: number, attributes: Readonly<Record<string, string>> = {}): void {
        this.record('histogram', name, value, attributes);
    }

    public recordGauge(name: string, value: number, attributes: Readonly<Record<string, string>> = {}): void {
        this.record('gauge', name, value, attributes);
    }

    public recordHttpRequest(method: string, path: string, status: string, durationMs: number): void {
        const attributes = { method, path, status };
        this.recordHistogram('http_request_duration_ms', durationMs, attributes);
        this.recordCounter('http_requests_total', 1, attributes);
    }

    public recordExternalHttpRequest(service: string, action: string, status: string, durationMs: number): void {
        const attributes = { service, action, status };
        this.recordHistogram('external_http_request_duration_ms', durationMs, attributes);
        this.recordCounter('external_http_request_total', 1, attributes);
    }

    public setExternalHttpConsecutiveFailures(service: string, action: string, failures: number): void {
        this.recordGauge('external_http_consecutive_failures', failures, { service, action });
    }

    public setCacheEntries(cache: string, entries: number): void {
        this.recordGauge('application_cache_entries', entries, { cache });
    }

    public recordCacheEviction(cache: string): void {
        this.recordCounter('application_cache_evictions_total', 1, { cache });
    }

    private record(kind: MetricKind, name: string, value: number, attributes: Readonly<Record<string, string>>): void {
        if (!Number.isFinite(value) || (kind === 'counter' && value < 0)) {
            this._logger.warn(`Invalid ${kind} value for metric ${name}`);
            return;
        }

        try {
            this._client.record(kind, name, value, attributes);
        } catch (error: unknown) {
            this._logger.warn(`OpenTelemetry metric ${name} could not be recorded: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // #endregion
}
