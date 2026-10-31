import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

/** Creates an OpenTelemetry scrape reader for long-running Prometheus targets. */
export function createPrometheusMetricReader(port?: number): PrometheusExporter {
    return new PrometheusExporter(port === undefined ? undefined : { port });
}
