import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { IMetricReaderOptions } from '../MetricReaderOptions.js';

/** Creates an OTLP/gRPC reader using the standard OpenTelemetry exporter configuration. */
export function createOtlpGrpcMetricReader(options: IMetricReaderOptions = {}): PeriodicExportingMetricReader {
    return new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
        exportIntervalMillis: options.exportIntervalMillis ?? 60_000,
    });
}
