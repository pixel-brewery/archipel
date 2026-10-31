import { ConsoleLogger, Inject, Injectable, Optional } from '@nestjs/common';
import type { ConsoleLoggerOptions, LoggerService, LogLevel } from '@nestjs/common';
import { isSpanContextValid, trace } from '@opentelemetry/api';
import { TelemetryRuleEngine } from '../rules/TelemetryRuleEngine.js';
import { TELEMETRY_LOGGER_OPTIONS } from '../tokens/TelemetryTokens.js';

/** ConsoleLogger rendering with active trace correlation and optional metric-rule forwarding. */
@Injectable()
export class TelemetryLoggerService extends ConsoleLogger implements LoggerService {
    // #region Fields
    private readonly _ruleEngine?: TelemetryRuleEngine;
    // #endregion

    // #region Ctor
    public constructor(@Optional() ruleEngine?: TelemetryRuleEngine, @Optional() @Inject(TELEMETRY_LOGGER_OPTIONS) options?: ConsoleLoggerOptions) {
        super(options ?? {});
        this._ruleEngine = ruleEngine;
    }
    // #endregion

    // #region Methods
    public override log(message: unknown, ...optionalParams: unknown[]): void {
        this.forward(message);
        super.log(message, ...optionalParams);
    }
    public override error(message: unknown, ...optionalParams: unknown[]): void {
        this.forward(message);
        super.error(message, ...optionalParams);
    }
    public override warn(message: unknown, ...optionalParams: unknown[]): void {
        this.forward(message);
        super.warn(message, ...optionalParams);
    }
    public override debug(message: unknown, ...optionalParams: unknown[]): void {
        this.forward(message);
        super.debug(message, ...optionalParams);
    }
    public override verbose(message: unknown, ...optionalParams: unknown[]): void {
        this.forward(message);
        super.verbose(message, ...optionalParams);
    }
    public override fatal(message: unknown, ...optionalParams: unknown[]): void {
        this.forward(message);
        super.fatal(message, ...optionalParams);
    }

    protected override formatMessage(
        logLevel: LogLevel,
        message: unknown,
        pidMessage: string,
        formattedLogLevel: string,
        contextMessage: string,
        timestampDiff: string,
        params?: Record<string, unknown>,
    ): string {
        const correlation = this.getCorrelation();
        const correlatedContext = correlation ? `${contextMessage}trace.id=${correlation['trace.id']} span.id=${correlation['span.id']} ` : contextMessage;
        return super.formatMessage(logLevel, message, pidMessage, formattedLogLevel, correlatedContext, timestampDiff, params);
    }

    protected override getJsonLogObject(
        message: unknown,
        options: {
            context: string;
            logLevel: LogLevel;
            writeStreamType?: 'stdout' | 'stderr';
            errorStack?: unknown;
            params?: Record<string, unknown>;
            error?: Error;
        },
    ): ReturnType<ConsoleLogger['getJsonLogObject']> {
        return { ...super.getJsonLogObject(message, options), ...this.getCorrelation() };
    }

    private getCorrelation(): { 'trace.id': string; 'span.id': string } | undefined {
        const spanContext = trace.getActiveSpan()?.spanContext();
        if (!spanContext || !isSpanContextValid(spanContext)) return undefined;
        return { 'trace.id': spanContext.traceId, 'span.id': spanContext.spanId };
    }

    private forward(message: unknown): void {
        if (typeof message !== 'string') return;
        try {
            this._ruleEngine?.process(message);
        } catch (error: unknown) {
            super.warn(`TelemetryRuleEngine.process failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    // #endregion
}
