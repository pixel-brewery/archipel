import type { DiagLogger } from '@opentelemetry/api';
import type { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import type { Instrumentation } from '@opentelemetry/instrumentation';
import type { MeterProvider, MetricReader } from '@opentelemetry/sdk-metrics';
import type { SpanExporter, TracerProvider } from '@opentelemetry/sdk-trace';
import type { IOtelInitResult } from '../interfaces/IOtelInitResult.js';
import type { ITelemetryOptions } from '../options/TelemetryOptions.js';

const defaultLifecycleTimeoutMillis = 5_000;

/**
 * Registers only the OpenTelemetry components selected by the application.
 * Import through the lightweight bootstrap entry point before loading the application
 * and modules that the selected instrumentations need to patch.
 */
export async function initializeOtel(options: ITelemetryOptions, metricReaders: MetricReader[] = []): Promise<IOtelInitResult> {
    if (!options.enabled) return {};

    let meterProvider: MeterProvider | undefined;
    let tracerProvider: TracerProvider | undefined;
    let traceExporter: SpanExporter | undefined;
    let contextManager: AsyncLocalStorageContextManager | undefined;
    let unregisterInstrumentations: (() => void) | undefined;
    let diagnostics: DiagLogger | undefined;

    try {
        const api = await import('@opentelemetry/api');
        diagnostics = api.diag;
        const resources = await import('@opentelemetry/resources');
        const semconv = await import('@opentelemetry/semantic-conventions');
        const detected = resources.detectResources({
            detectors: options.resourceDetectors ?? [resources.envDetector, resources.processDetector, resources.hostDetector],
        });
        const resource = detected.merge(
            resources.resourceFromAttributes({
                ...options.resourceAttributes,
                [semconv.ATTR_SERVICE_NAME]: options.serviceName,
                ...(options.serviceVersion === undefined ? {} : { [semconv.ATTR_SERVICE_VERSION]: options.serviceVersion }),
                environment: options.environment ?? 'local',
            }),
        );

        if (options.metrics?.enabled && metricReaders.length > 0) {
            const sdkMetrics = await import('@opentelemetry/sdk-metrics');
            meterProvider = new sdkMetrics.MeterProvider({ resource, readers: metricReaders });
            api.metrics.setGlobalMeterProvider(meterProvider);
        }

        if (options.traces?.enabled) {
            const traceSdk = await import('@opentelemetry/sdk-trace');
            const contextHooks = await import('@opentelemetry/context-async-hooks');
            const core = await import('@opentelemetry/core');
            traceExporter =
                options.spanExporter ??
                (options.traces.exporter === 'console'
                    ? new traceSdk.ConsoleSpanExporter()
                    : new (await import('@opentelemetry/exporter-trace-otlp-http')).OTLPTraceExporter());
            tracerProvider = new traceSdk.TracerProvider({
                resource,
                sampler: new traceSdk.TraceIdRatioBasedSampler(options.traces.samplingRatio ?? 0.05),
                spanProcessors: [new traceSdk.BatchSpanProcessor({ exporter: traceExporter })],
            });
            contextManager = new contextHooks.AsyncLocalStorageContextManager();
            api.context.setGlobalContextManager(contextManager.enable());
            api.propagation.setGlobalPropagator(
                new core.CompositePropagator({
                    propagators: [new core.W3CTraceContextPropagator(), new core.W3CBaggagePropagator()],
                }),
            );
            api.trace.setGlobalTracerProvider(tracerProvider);
        }

        const instrumentations: Instrumentation[] = [...(options.extraInstrumentations ?? [])];
        if (options.instrumentation?.http) {
            const http = await import('@opentelemetry/instrumentation-http');
            instrumentations.push(new http.HttpInstrumentation());
        }
        if (options.instrumentation?.express) {
            const express = await import('@opentelemetry/instrumentation-express');
            instrumentations.push(new express.ExpressInstrumentation());
        }
        if (instrumentations.length > 0) {
            const { registerInstrumentations } = await import('@opentelemetry/instrumentation');
            unregisterInstrumentations = () => {
                for (const instrumentation of instrumentations) {
                    try {
                        instrumentation.disable();
                    } catch (error: unknown) {
                        diagnostics?.error('Failed to disable OpenTelemetry instrumentation.', error);
                    }
                }
            };
            unregisterInstrumentations = registerInstrumentations({
                instrumentations,
                tracerProvider,
                meterProvider,
            });
        }

        let shutdown: Promise<void> | undefined;
        diagnostics.debug('OpenTelemetry SDK initialized successfully.');
        return {
            sdk: {
                forceFlush: async (timeoutMillis = defaultLifecycleTimeoutMillis) => {
                    const pendingShutdown = shutdown;
                    if (pendingShutdown) return withTimeout(() => pendingShutdown, timeoutMillis);
                    await withTimeout(async () => {
                        const traceFlush = async (): Promise<PromiseSettledResult<void>[]> => {
                            const queue = await Promise.allSettled([Promise.resolve().then(() => tracerProvider?.forceFlush({ timeoutMillis }))]);
                            const transport = await Promise.allSettled([Promise.resolve().then(() => traceExporter?.forceFlush?.())]);
                            return [...queue, ...transport];
                        };
                        const results = await Promise.all([
                            Promise.allSettled([Promise.resolve().then(() => meterProvider?.forceFlush({ timeoutMillis }))]),
                            traceFlush(),
                        ]);
                        const failures: unknown[] = results.flat().flatMap((result) => (result.status === 'rejected' ? [result.reason] : []));
                        if (failures.length === 1) throw failures[0];
                        if (failures.length > 1) throw new AggregateError(failures, 'OpenTelemetry SDK flush failed.');
                    }, timeoutMillis);
                },
                shutdown: (timeoutMillis = defaultLifecycleTimeoutMillis) => {
                    if (!shutdown) {
                        shutdown = withTimeout(async () => {
                            await Promise.all([
                                Promise.resolve().then(() => unregisterInstrumentations?.()),
                                meterProvider?.shutdown({ timeoutMillis }),
                                tracerProvider?.shutdown(),
                            ]);
                        }, timeoutMillis).finally(() => contextManager?.disable());
                    }
                    return shutdown;
                },
            },
        };
    } catch (error: unknown) {
        try {
            await withTimeout(async () => {
                await Promise.allSettled([Promise.resolve().then(() => unregisterInstrumentations?.()), meterProvider?.shutdown(), tracerProvider?.shutdown()]);
            }, defaultLifecycleTimeoutMillis);
        } catch (cleanupError: unknown) {
            diagnostics?.error('Failed to finish OpenTelemetry SDK cleanup.', cleanupError);
        } finally {
            contextManager?.disable();
        }
        const message = 'Failed to initialize OpenTelemetry SDK. Telemetry will be degraded.';
        if (diagnostics) diagnostics.error(message, error);
        else console.error(message);
        return {};
    }
}

async function withTimeout(operation: () => Promise<void>, timeoutMillis: number): Promise<void> {
    if (!Number.isFinite(timeoutMillis) || timeoutMillis <= 0 || timeoutMillis > 2_147_483_647) {
        throw new RangeError('OpenTelemetry lifecycle timeout must be a positive finite number of milliseconds.');
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
        await Promise.race([
            Promise.resolve().then(operation),
            new Promise<never>((_resolve, reject) => {
                timer = setTimeout(() => reject(new Error(`OpenTelemetry lifecycle operation exceeded ${timeoutMillis}ms.`)), timeoutMillis);
            }),
        ]);
    } finally {
        if (timer !== undefined) clearTimeout(timer);
    }
}
