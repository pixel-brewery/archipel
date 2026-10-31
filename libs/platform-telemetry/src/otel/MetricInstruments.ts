import type { Counter, Histogram } from '@opentelemetry/api';

/** Built-in OpenTelemetry instruments used by telemetry operations. */
export interface IMetricInstruments {
    cacheCounter?: Counter;
    opCounter?: Counter;
    opDuration?: Histogram;
}
