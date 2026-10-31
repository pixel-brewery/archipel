import { Injectable } from '@nestjs/common';
import type { Counter, Gauge, Histogram, Meter } from '@opentelemetry/api';
import type { IMetricInstruments } from '../MetricInstruments.js';
import type { MetricKind } from '../MetricKind.js';

/** Owns OpenTelemetry metric instruments and their recording semantics. */
@Injectable()
export class OtelMetricClient {
    // #region Fields

    private _meter?: Meter;
    private readonly _instruments = new Map<string, { kind: MetricKind; instrument: Counter | Gauge | Histogram }>();

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public async initialize(): Promise<void> {
        if (this._meter) return;
        const api = await import('@opentelemetry/api');
        this._meter = api.metrics.getMeter('archipel-platform-telemetry');
        if (!this._instruments.has('cache_event_total')) {
            this._instruments.set('cache_event_total', {
                kind: 'counter',
                instrument: this._meter.createCounter('cache_event_total'),
            });
        }
        if (!this._instruments.has('operation_event_total')) {
            this._instruments.set('operation_event_total', {
                kind: 'counter',
                instrument: this._meter.createCounter('operation_event_total'),
            });
        }
        if (!this._instruments.has('operation_duration_ms')) {
            this._instruments.set('operation_duration_ms', {
                kind: 'histogram',
                instrument: this._meter.createHistogram('operation_duration_ms'),
            });
        }
    }

    public getInstruments(): IMetricInstruments | undefined {
        if (!this._meter) return undefined;
        return {
            cacheCounter: this._instruments.get('cache_event_total')?.instrument as Counter | undefined,
            opCounter: this._instruments.get('operation_event_total')?.instrument as Counter | undefined,
            opDuration: this._instruments.get('operation_duration_ms')?.instrument as Histogram | undefined,
        };
    }

    public record(kind: MetricKind, name: string, value: number, attributes: Readonly<Record<string, string>>): void {
        if (!this._meter) {
            throw new Error('OpenTelemetry metric provider is not initialized');
        }
        let entry = this._instruments.get(name);
        if (entry && entry.kind !== kind) {
            throw new Error(`Metric ${name} was already registered with another type`);
        }
        if (!entry) {
            if (this._instruments.size >= 128) {
                throw new Error('OpenTelemetry metric definition limit reached');
            }
            const instrument =
                kind === 'counter' ? this._meter.createCounter(name) : kind === 'gauge' ? this._meter.createGauge(name) : this._meter.createHistogram(name);
            entry = { kind, instrument };
            this._instruments.set(name, entry);
        }
        if (entry.kind === 'histogram') {
            (entry.instrument as Histogram).record(value, attributes);
        } else if (entry.kind === 'gauge') {
            (entry.instrument as Gauge).record(value, attributes);
        } else {
            (entry.instrument as Counter).add(value, attributes);
        }
    }

    // #endregion
}
