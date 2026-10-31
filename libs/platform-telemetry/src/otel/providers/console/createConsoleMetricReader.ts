import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import type { IMetricReaderOptions } from '../MetricReaderOptions.js';

/** Creates a console reader for local diagnostics. */
export function createConsoleMetricReader(options: IMetricReaderOptions = {}): PeriodicExportingMetricReader {
    return new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
        exportIntervalMillis: options.exportIntervalMillis ?? 60_000,
    });
}
