// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { MeasurementSinkBase } from '../../abstracts/MeasurementSinkBase.js';
import { Inject, Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { NEW_RELIC_LICENSE_KEY } from './env.js';
import type { INewRelicMeasurementOptions } from './NewRelicMeasurementOptions.js';
import { NEW_RELIC_MEASUREMENT_OPTIONS } from './NewRelicMeasurementToken.js';
import { gzipSync } from 'node:zlib';

// #endregion

type MetricPoint =
    | {
          name: string;
          type: 'gauge' | 'count';
          value: number;
          timestamp: number;
          'interval.ms'?: number;
          attributes: Readonly<Record<string, string>>;
      }
    | {
          name: string;
          type: 'summary';
          value: { count: number; sum: number; min: number; max: number };
          timestamp: number;
          'interval.ms': number;
          attributes: Readonly<Record<string, string>>;
      };

const EXPORT_TIMEOUT_MS = 5000;
const MAX_PENDING_METRICS = 500;
const MAX_EXPORT_BATCHES = 8;

/** Delivers measurements and sanitized operational failure logs to an explicitly selected New Relic region. */
@Injectable()
export class NewRelicMeasurementSink extends MeasurementSinkBase implements OnModuleDestroy {
    // #region Fields

    private readonly _config: ConfigService;
    private readonly _options: INewRelicMeasurementOptions;
    private readonly _shutdown = new AbortController();
    private _closing = false;
    private readonly _logger = new Logger(NewRelicMeasurementSink.name);
    private readonly _pending: MetricPoint[] = [];
    private _scheduledExport?: Promise<void>;
    private _dropped = 0;

    // #endregion

    // #region Ctor

    public constructor(config: ConfigService, @Inject(NEW_RELIC_MEASUREMENT_OPTIONS) options: INewRelicMeasurementOptions) {
        super();
        if (options.region !== 'eu' && options.region !== 'us') {
            throw new Error('New Relic region must be eu or us.');
        }
        this._config = config;
        this._options = options;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public record(name: string, value: number, attributes: Readonly<Record<string, string>>): void {
        const licenseKey = this._config.tryGet<string>(NEW_RELIC_LICENSE_KEY.key, '');
        if (this._closing || !licenseKey?.trim()) {
            return;
        }

        if (this._pending.length >= MAX_PENDING_METRICS) {
            this._dropped++;
            if (this._dropped === 1) {
                this._logger.warn('New Relic metric buffer is full; measurements are being dropped.');
            }
            // Prefer diagnostic failures to ordinary measurements during backpressure.
            const ordinary = this._pending.findIndex((point) => point.name !== 'operational_failures_total');
            if (name !== 'operational_failures_total' || ordinary < 0) {
                return;
            }
            this._pending.splice(ordinary, 1);
        }
        this._pending.push(this.toMetricPoint(name, value, attributes));
        this._scheduledExport ??= Promise.resolve()
            .then(async () => {
                for (let batch = 0; batch < MAX_EXPORT_BATCHES && this._pending.length > 0; batch++) {
                    const metrics = this._pending.splice(0);
                    if (this._dropped > 0) {
                        metrics.push(this.toMetricPoint('telemetry_dropped_total', this._dropped, {}));
                        this._dropped = 0;
                    }
                    await this.deliver(metrics, licenseKey);
                }
            })
            .catch(() => {
                this._logger.warn('New Relic metric delivery failed.');
            })
            .finally(() => {
                if (this._pending.length > 0) {
                    this._pending.splice(0);
                    this._logger.warn('New Relic export budget exhausted; measurements were dropped.');
                }
                this._scheduledExport = undefined;
            });

        if (this._options.retain) {
            try {
                this._options.retain(this._scheduledExport);
            } catch {
                this._logger.warn('Metric delivery could not join the host lifecycle.');
            }
        }
    }

    /** Drains pending delivery for at most five seconds, then aborts in-flight requests. */
    public async onModuleDestroy(): Promise<void> {
        this._closing = true;
        let deadline: ReturnType<typeof setTimeout> | undefined;
        try {
            await Promise.race([
                this._scheduledExport,
                new Promise<void>((resolve) => {
                    deadline = setTimeout(resolve, EXPORT_TIMEOUT_MS);
                    deadline.unref();
                }),
            ]);
        } finally {
            clearTimeout(deadline);
            this._shutdown.abort();
        }
    }

    private toMetricPoint(name: string, value: number, attributes: Readonly<Record<string, string>>): MetricPoint {
        const base = { name, timestamp: Date.now(), attributes: { ...attributes } };
        if (name.endsWith('_total')) {
            return { ...base, type: 'count', value, 'interval.ms': 1 };
        }
        if (name.endsWith('_duration_ms')) {
            return {
                ...base,
                type: 'summary',
                value: { count: 1, sum: value, min: value, max: value },
                'interval.ms': 1,
            };
        }
        return { ...base, type: 'gauge', value };
    }

    private async deliver(metrics: ReadonlyArray<MetricPoint>, licenseKey: string): Promise<void> {
        if (metrics.length === 0) {
            return;
        }

        // Correlation IDs belong only in diagnostic logs, never in metric dimensions.
        const metricPoints = metrics.map((point) => ({
            ...point,
            attributes: Object.fromEntries(Object.entries(point.attributes).filter(([key]) => key !== 'request.id')),
        }));
        const commonAttributes = this._options.attributes;
        const body = JSON.stringify([
            {
                common: {
                    attributes: commonAttributes,
                },
                metrics: metricPoints,
            },
        ]);
        const failures = metrics.filter((point) => point.name === 'operational_failures_total');
        const deliveries = [this.post(this.endpoint('metric'), body, licenseKey, 'metric')];
        if (this._options.durationEvents) {
            const durations = metricPoints.filter((point) => point.type === 'summary' && point.value.count === 1);
            if (durations.length > 0) {
                deliveries.push(
                    this.post(
                        this.endpoint('event'),
                        JSON.stringify(
                            durations.map((point) => ({
                                ...commonAttributes,
                                ...point.attributes,
                                eventType: 'MeasurementDuration',
                                timestamp: point.timestamp,
                                'measurement.name': point.name,
                                durationMs: point.type === 'summary' ? point.value.sum : 0,
                                'service.version': this._options.serviceVersion ?? 'unknown',
                            })),
                        ),
                        licenseKey,
                        'event',
                    ),
                );
            }
        }
        if (failures.length > 0) {
            deliveries.push(
                this.post(
                    this.endpoint('log'),
                    JSON.stringify([
                        {
                            common: {
                                attributes: {
                                    ...commonAttributes,
                                    'service.version': this._options.serviceVersion ?? 'unknown',
                                    logtype: 'operational_failure',
                                },
                            },
                            logs: failures.map((point) => ({
                                timestamp: point.timestamp,
                                message: 'Operational failure',
                                attributes: { ...point.attributes, level: 'ERROR' },
                            })),
                        },
                    ]),
                    licenseKey,
                    'log',
                ),
            );
        }
        await Promise.allSettled(deliveries);
    }

    private endpoint(kind: 'metric' | 'log' | 'event'): string {
        if (kind === 'event') {
            const host = this._options.region === 'eu' ? 'insights-collector.eu01.nr-data.net' : 'insights-collector.newrelic.com';
            return `https://${host}/v1/accounts/events`;
        }
        const region = this._options.region === 'eu' ? '.eu' : '';
        return `https://${kind}-api${region}.newrelic.com/${kind}/v1`;
    }

    private async post(url: string, body: string, licenseKey: string, kind: 'metric' | 'log' | 'event'): Promise<void> {
        try {
            const payload = kind === 'event' ? gzipSync(body) : body;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Api-Key': licenseKey,
                    'Content-Type': 'application/json',
                    'Content-Length': String(Buffer.byteLength(payload)),
                    ...(kind === 'event' ? { 'Content-Encoding': 'gzip' } : {}),
                },
                body: payload,
                signal: AbortSignal.any([AbortSignal.timeout(EXPORT_TIMEOUT_MS), this._shutdown.signal]),
            });

            if (response.status !== 202 && !(kind === 'event' && response.status === 200)) {
                this._logger.warn(`New Relic ${kind} delivery returned HTTP ${response.status}.`);
            }
            await response.body?.cancel();
        } catch {
            this._logger.warn(`New Relic ${kind} delivery failed.`);
        }
    }

    // #endregion
}
