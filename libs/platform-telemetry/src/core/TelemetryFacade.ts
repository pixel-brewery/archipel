import { Logger } from '@nestjs/common';
import { ITelemetryFacade } from './NoopTelemetryFacade.js';
import { MetricsService } from '../otel/MetricsService.js';
import type { ITelemetryOptions } from '../options/TelemetryOptions.js';

export class TelemetryFacade implements ITelemetryFacade {
    // #region Fields

    private readonly _logger: Logger;
    private readonly _metrics?: MetricsService;
    private readonly _pattern?: ITelemetryOptions['pattern'];

    // #endregion

    // #region Ctor

    public constructor(logger?: Logger, metrics?: MetricsService, pattern?: ITelemetryOptions['pattern']) {
        this._logger = logger ?? new Logger(TelemetryFacade.name);
        this._metrics = metrics;
        this._pattern = pattern;
    }

    // #endregion

    // #region Methods

    public async runOperation<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
        const start = Date.now();
        try {
            const result = await fn();
            const dur = Date.now() - start;
            if (this._pattern?.enableOperationMetrics !== false) {
                this._metrics?.recordCounter('operation_event_total', 1, { name, status: 'success' });
                this._metrics?.recordHistogram('operation_duration_ms', dur, { name, status: 'success' });
            }
            this._logger.debug(`Operation ${name} succeeded in ${dur} ms`);
            return result;
        } catch (err) {
            const dur = Date.now() - start;
            if (this._pattern?.enableOperationMetrics !== false) {
                this._metrics?.recordCounter('operation_event_total', 1, { name, status: 'error' });
                this._metrics?.recordHistogram('operation_duration_ms', dur, { name, status: 'error' });
            }
            this._logger.warn(`Operation ${name} failed in ${dur} ms: ${(err as Error).name}`);
            throw err;
        }
    }

    public recordCacheEvent(event: { cache: string; outcome: string; phase?: string }): void {
        if (this._pattern?.enableCacheMetrics === false) return;
        this._metrics?.recordCounter('cache_event_total', 1, {
            cache: event.cache,
            outcome: event.outcome,
            phase: event.phase ?? 'none',
        });
    }

    public recordClientMetric(name: string, type: string, value: number, labels?: Record<string, string>): void {
        if (type === 'counter') {
            this._metrics?.recordCounter(name, value, labels);
        } else if (type === 'histogram') {
            this._metrics?.recordHistogram(name, value, labels);
        } else if (type === 'gauge') {
            this._metrics?.recordGauge(name, value, labels);
        } else {
            this._logger.warn(`Unsupported client metric type: ${type}`);
        }
    }

    public getLogger(): Logger {
        return this._logger;
    }

    // #endregion
}
