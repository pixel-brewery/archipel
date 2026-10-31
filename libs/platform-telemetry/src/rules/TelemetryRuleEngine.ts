import { Logger } from '@nestjs/common';
import { MetricsService } from '../otel/MetricsService.js';
import { ITelemetryOptions } from '../options/TelemetryOptions.js';

export class TelemetryRuleEngine {
    // #region Fields
    private readonly _options: ITelemetryOptions;
    private readonly _metricsService?: MetricsService;
    private readonly _logger = new Logger(TelemetryRuleEngine.name);
    // #endregion

    // #region Ctor
    public constructor(options: ITelemetryOptions, metricsService?: MetricsService) {
        this._options = options;
        this._metricsService = metricsService;
    }
    // #endregion

    // #region Methods
    public process(message: string): void {
        if (!this._options.enabled) return;
        if (message.startsWith('cache.event')) {
            this.handleCache(message);
            return;
        }
        if (message.startsWith('op.success') || message.startsWith('op.error')) {
            this.handleOperation(message);
        }
        if (message.startsWith('client.metric')) {
            this.handleClientMetric(message);
        }
    }

    private handleCache(line: string): void {
        if (!this._options.pattern?.enableCacheMetrics || !this._metricsService) return;
        const tokens = this.parseTokens(line);
        this._metricsService.recordCounter('cache_event_total', 1, {
            cache: tokens['cache'] ?? 'unknown',
            outcome: tokens['outcome'] ?? 'unknown',
            phase: tokens['phase'] ?? 'none',
        });
    }

    private handleOperation(line: string): void {
        if (!this._options.pattern?.enableOperationMetrics || !this._metricsService) return;
        const success = line.startsWith('op.success');
        const tokens = this.parseTokens(line);
        const labels = {
            name: tokens['name'] ?? 'unknown',
            status: success ? 'success' : 'error',
        };
        this._metricsService.recordCounter('operation_event_total', 1, labels);
        const dur = tokens['duration_ms'] ? Number(tokens['duration_ms']) : undefined;
        if (dur !== undefined && !Number.isNaN(dur)) {
            this._metricsService.recordHistogram('operation_duration_ms', dur, labels);
        }
    }

    private handleClientMetric(line: string): void {
        if (!this._metricsService) return;
        const tokens = this.parseTokens(line);
        const name = tokens['name'] ?? 'unknown';
        const valueRaw = tokens['value'] ? Number(tokens['value']) : undefined;
        const type = tokens['type'] ?? 'counter';
        const labels = { source: 'client', name };
        if (valueRaw === undefined || !Number.isFinite(valueRaw)) return;
        if (type === 'counter') {
            this._metricsService.recordCounter('client_metric_total', valueRaw, labels);
        } else if (type === 'gauge') {
            this._metricsService.recordGauge('client_metric_gauge', valueRaw, labels);
        } else if (type === 'histogram') {
            this._metricsService.recordHistogram('client_metric_histogram', valueRaw, labels);
        } else {
            this._logger.warn(`Unsupported client metric type: ${type}`);
        }
    }

    private parseTokens(line: string): Record<string, string> {
        const parts = line.split(/\s+/).slice(1);
        const out: Record<string, string> = {};
        for (const p of parts) {
            const eq = p.indexOf('=');
            if (eq > 0) {
                out[p.substring(0, eq)] = p.substring(eq + 1);
            }
        }
        return out;
    }
    // #endregion
}
