import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IDiagnosticsOptions } from './DiagnosticsOptions.js';
import { DIAGNOSTICS_OPTIONS } from './DiagnosticsToken.js';
import { MeasurementsService } from './MeasurementsService.js';

/** Records dependency outcomes and sanitized failures through the selected measurement sink. */
@Injectable()
export class DiagnosticsService {
    // #region Fields

    private readonly _logger = new Logger(DiagnosticsService.name);
    private readonly _measurements: MeasurementsService;
    private readonly _options: IDiagnosticsOptions;

    // #endregion

    // #region Ctor

    public constructor(measurements: MeasurementsService, @Inject(DIAGNOSTICS_OPTIONS) options: IDiagnosticsOptions) {
        this._measurements = measurements;
        this._options = options;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /** Records one outcome and its duration. Use stable operation names and bounded context values. */
    public complete(operation: string, durationMs: number, outcome: 'success' | 'failure' | 'skipped', context: Readonly<Record<string, string>> = {}): void {
        const attributes = { ...context, outcome };
        this._measurements.record(`${operation}_total`, 1, attributes);
        this._measurements.record(`${operation}_duration_ms`, durationMs, attributes);
    }

    /** Records a gauge without adding request or business identifiers. */
    public gauge(name: string, value: number): void {
        this._measurements.record(name, value);
    }

    /**
     * Records a failure without serializing the thrown value. Background work can suppress request correlation.
     * Classification and correlation callbacks are best effort and cannot replace the application failure.
     */
    public failure(
        component: string,
        operation: string,
        error: unknown,
        context: Readonly<Record<string, string>> = {},
        options: { readonly correlate?: boolean } = {},
    ): void {
        let classification: Readonly<Record<string, string>> = { 'failure.kind': 'unknown', 'error.code': 'UNKNOWN', 'cause.code': 'UNKNOWN' };
        let requestId: string | undefined;
        try {
            classification = this._options.classifyFailure?.(error) ?? classification;
        } catch {
            this._logger.warn('Failure classification failed.');
        }
        try {
            if (options.correlate !== false) requestId = this._options.getCorrelationId?.();
        } catch {
            this._logger.warn('Failure correlation failed.');
        }
        const attributes = { ...context, ...classification, component, operation };
        this._logger.error(JSON.stringify({ message: 'Operational failure', ...attributes, requestId }));
        this._measurements.record('operational_failures_total', 1, {
            ...attributes,
            ...(requestId ? { 'request.id': requestId } : {}),
        });
    }

    // #endregion
}
