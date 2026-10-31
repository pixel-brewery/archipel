import type { Attributes } from '@opentelemetry/api';
import type { Instrumentation } from '@opentelemetry/instrumentation';
import type { ResourceDetector } from '@opentelemetry/resources';
import type { SpanExporter } from '@opentelemetry/sdk-trace';

export interface ITelemetryTracesOptions {
    enabled: boolean;
    samplingRatio?: number; // 0..1
    exporter?: 'otlp-http' | 'console';
}

export interface ITelemetryMetricsOptions {
    enabled: boolean;
}

export interface ITelemetryOptions {
    enabled: boolean;
    serviceName: string;
    /** Host release version attached to the service resource. */
    serviceVersion?: string;
    environment?: string;
    /** Additional host-owned resource metadata; omit credentials and private data. */
    resourceAttributes?: Attributes;
    /** Overrides automatic environment/process/host detection; use [] for explicit metadata only. */
    resourceDetectors?: ResourceDetector[];
    /** Explicit host exporter; takes precedence over traces.exporter. */
    spanExporter?: SpanExporter;
    /** Host-selected instrumentations registered alongside the built-in selections. */
    extraInstrumentations?: Instrumentation[];
    traces?: ITelemetryTracesOptions;
    metrics?: ITelemetryMetricsOptions;
    logCorrelation?: boolean;
    instrumentation?: {
        http?: boolean;
        express?: boolean;
    };
    pattern?: {
        enableCacheMetrics?: boolean;
        enableOperationMetrics?: boolean;
    };
    interceptor?: {
        operation?: boolean;
    };
}

export const defaultTelemetryOptions: ITelemetryOptions = {
    enabled: true,
    serviceName: 'app',
    traces: {
        enabled: true,
        samplingRatio: 0.05,
        exporter: 'otlp-http',
    },
    metrics: {
        enabled: false,
    },
    logCorrelation: true,
    instrumentation: {
        http: true,
        express: true,
    },
    pattern: {
        enableCacheMetrics: true,
        enableOperationMetrics: true,
    },
    interceptor: {
        operation: true,
    },
};

/**
 * Validates telemetry options and throws on invalid values.
 */
export function validateTelemetryOptions(options: ITelemetryOptions): void {
    if (options.enabled && (!options.serviceName || options.serviceName.trim().length === 0)) {
        throw new Error('TelemetryOptions: serviceName must be a non-empty string when telemetry is enabled.');
    }
    const ratio = options.traces?.samplingRatio;
    if (ratio !== undefined && (ratio < 0 || ratio > 1)) {
        throw new Error(`TelemetryOptions: traces.samplingRatio must be between 0 and 1, got ${ratio}.`);
    }
}
