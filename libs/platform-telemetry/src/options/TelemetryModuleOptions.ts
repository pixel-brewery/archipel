import type { MetricReader } from '@opentelemetry/sdk-metrics';
import type { IOtelSdk } from '../interfaces/IOtelSdk.js';
import type { ITelemetryOptions } from './TelemetryOptions.js';

/** Telemetry SDK options with explicitly selected OpenTelemetry metric readers. */
export interface ITelemetryModuleOptions extends Partial<ITelemetryOptions> {
    /** Adopts a pre-bootstrap SDK and its shutdown lifecycle instead of starting another provider. */
    sdk?: IOtelSdk;
    metricReaders?: MetricReader[];
    httpMetricsInterceptor?: boolean;
}
