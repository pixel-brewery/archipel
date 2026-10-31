import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { MeasurementSinkBase } from './abstracts/MeasurementSinkBase.js';

/** Records individual numeric values without imposing an aggregation model. */
@Injectable()
export class MeasurementsService implements OnModuleInit {
    // #region Fields

    private readonly _logger = new Logger(MeasurementsService.name);
    private readonly _sink: MeasurementSinkBase;

    // #endregion

    // #region Ctor

    public constructor(@Inject(MeasurementSinkBase) sink: MeasurementSinkBase) {
        this._sink = sink;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public async onModuleInit(): Promise<void> {
        try {
            await this._sink.initialize();
        } catch (error: unknown) {
            this._logger.warn(`Measurement sink could not initialize: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public record(name: string, value: number, attributes: Readonly<Record<string, string>> = {}): void {
        if (!name || !Number.isFinite(value)) {
            this._logger.warn(`Invalid numeric measurement: ${name}`);
            return;
        }

        try {
            this._sink.record(name, value, attributes);
        } catch (error: unknown) {
            this._logger.warn(`Measurement ${name} could not be recorded: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public recordHttpRequest(method: string, path: string, status: string, durationMs: number): void {
        const attributes = { method, path, status };
        this.record('http_request_duration_ms', durationMs, attributes);
        this.record('http_requests_total', 1, attributes);
    }

    public recordExternalHttpRequest(service: string, action: string, status: string, durationMs: number): void {
        const attributes = { service, action, status };
        this.record('external_http_request_duration_ms', durationMs, attributes);
        this.record('external_http_request_total', 1, attributes);
    }

    public setExternalHttpConsecutiveFailures(service: string, action: string, failures: number): void {
        this.record('external_http_consecutive_failures', failures, { service, action });
    }

    public setCacheEntries(cache: string, entries: number): void {
        this.record('application_cache_entries', entries, { cache });
    }

    public recordCacheEviction(cache: string): void {
        this.record('application_cache_evictions_total', 1, { cache });
    }

    // #endregion
}
