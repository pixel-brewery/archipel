import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { IMetricReaderOptions } from '../MetricReaderOptions.js';

/** Creates an OTLP/HTTP reader using the standard OpenTelemetry exporter configuration. */
export function createOtlpHttpMetricReader(options: IMetricReaderOptions = {}): PeriodicExportingMetricReader {
    return new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
        exportIntervalMillis: options.exportIntervalMillis ?? 60_000,
    });
}
