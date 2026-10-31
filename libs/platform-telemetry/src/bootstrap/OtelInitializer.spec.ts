import { context, diag, metrics, propagation, trace } from '@opentelemetry/api';
import type { Tracer } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { ExportResultCode } from '@opentelemetry/core';
import type { Instrumentation } from '@opentelemetry/instrumentation';
import { AggregationTemporality, InMemoryMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { ConsoleSpanExporter, InMemorySpanExporter, type ReadableSpan, type SpanExporter, TracerProvider } from '@opentelemetry/sdk-trace';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OtelMetricClient } from '../otel/client/OtelMetricClient.js';
import { initializeOtel } from './OtelInitializer.js';

afterEach(() => {
    context.disable();
    propagation.disable();
    metrics.disable();
    trace.disable();
    vi.restoreAllMocks();
    vi.useRealTimers();
});

describe('OpenTelemetry metric bootstrap', () => {
    it('exports one instrument to every explicitly selected reader', async () => {
        const exporters = [new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE), new InMemoryMetricExporter(AggregationTemporality.CUMULATIVE)];
        const readers = exporters.map(
            (exporter) =>
                new PeriodicExportingMetricReader({
                    exporter,
                    exportIntervalMillis: 60_000,
                }),
        );
        const { sdk } = await initializeOtel(
            {
                enabled: true,
                serviceName: 'telemetry-test',
                traces: { enabled: false },
                metrics: { enabled: true },
                instrumentation: { http: false, express: false },
            },
            readers,
        );

        expect(sdk).toBeDefined();
        try {
            const client = new OtelMetricClient();
            await client.initialize();
            client.record('counter', 'orders_total', 2, { status: 'paid' });
            await sdk?.forceFlush();

            for (const exporter of exporters) {
                const points = exporter
                    .getMetrics()
                    .flatMap((resource) => resource.scopeMetrics)
                    .flatMap((scope) => scope.metrics);
                const orders = points.find((point) => point.descriptor.name === 'orders_total');
                expect(orders?.dataPoints).toEqual(expect.arrayContaining([expect.objectContaining({ value: 2 })]));
            }
        } finally {
            await sdk?.shutdown();
            metrics.disable();
        }
    });
});

describe('OpenTelemetry tracing bootstrap', () => {
    it('exports related spans across asynchronous work and propagates their trace context', async () => {
        // arrange
        const exportedSpans: ReadableSpan[] = [];
        const carrier: Record<string, string> = {};
        vi.spyOn(ConsoleSpanExporter.prototype, 'export').mockImplementation((spans, callback) => {
            exportedSpans.push(...spans);
            callback({ code: ExportResultCode.SUCCESS });
        });
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'tracing-test',
            traces: { enabled: true, exporter: 'console', samplingRatio: 1 },
        });
        const tracer = trace.getTracer('tracing-test');

        // act
        try {
            await tracer.startActiveSpan('parent-operation', async (parent) => {
                try {
                    await Promise.resolve();
                    propagation.inject(context.active(), carrier);
                    tracer.startSpan('child-operation').end();
                } finally {
                    parent.end();
                }
            });
        } finally {
            await sdk?.shutdown();
        }

        // assert
        const parent = exportedSpans.find((span) => span.name === 'parent-operation');
        const child = exportedSpans.find((span) => span.name === 'child-operation');
        expect(sdk).toBeDefined();
        expect(exportedSpans).toHaveLength(2);
        expect(parent?.resource.attributes['service.name']).toBe('tracing-test');
        expect(child?.parentSpanContext).toEqual(parent?.spanContext());
        expect(child?.spanContext().traceId).toBe(parent?.spanContext().traceId);
        expect(carrier['traceparent']).toBe(`00-${parent?.spanContext().traceId}-${parent?.spanContext().spanId}-01`);
    });

    it('cleans up a partially initialized tracer when context registration fails', async () => {
        // arrange
        const failure = new Error('test-only-context-startup-failure');
        vi.spyOn(AsyncLocalStorageContextManager.prototype, 'enable').mockImplementation(() => {
            throw failure;
        });
        const shutdown = vi.spyOn(TracerProvider.prototype, 'shutdown');
        const disable = vi.spyOn(AsyncLocalStorageContextManager.prototype, 'disable');
        const logError = vi.spyOn(diag, 'error').mockImplementation(() => undefined);

        // act
        const result = await initializeOtel({
            enabled: true,
            serviceName: 'tracing-test',
            traces: { enabled: true, exporter: 'console' },
        });

        // assert
        expect(result).toEqual({});
        expect(shutdown).toHaveBeenCalledOnce();
        expect(disable).toHaveBeenCalledOnce();
        expect(logError).toHaveBeenCalledWith('Failed to initialize OpenTelemetry SDK. Telemetry will be degraded.', failure);
    });
});

describe('OpenTelemetry bootstrap lifecycle', () => {
    it('exports through the host exporter without stopping subsequent traces and uses only explicit resource metadata', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        const shutdown = vi.spyOn(exporter, 'shutdown');
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            serviceVersion: 'test-release',
            environment: 'test-stage',
            resourceDetectors: [],
            resourceAttributes: { 'deployment.environment.name': 'test-stage', 'host.selection': 'explicit' },
            spanExporter: exporter,
            traces: { enabled: true, exporter: 'console', samplingRatio: 1 },
        });
        const tracer = trace.getTracer('host-test');

        // act
        try {
            tracer.startSpan('first-operation').end();
            await sdk?.forceFlush();
            tracer.startSpan('second-operation').end();
            await sdk?.forceFlush();

            // assert
            expect(sdk).toBeDefined();
            expect(shutdown).not.toHaveBeenCalled();
            expect(exporter.getFinishedSpans().map((span) => span.name)).toEqual(['first-operation', 'second-operation']);
            expect(exporter.getFinishedSpans()[0]?.resource.attributes).toEqual({
                'service.name': 'host-service',
                'service.version': 'test-release',
                environment: 'test-stage',
                'deployment.environment.name': 'test-stage',
                'host.selection': 'explicit',
            });
        } finally {
            await sdk?.shutdown();
        }
    });

    it('gives additional host instrumentation the selected tracer provider and disposes it once', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        let instrumentedTracer: Tracer | undefined;
        const instrumentation: Instrumentation = {
            instrumentationName: 'test-only-instrumentation',
            instrumentationVersion: '1.0.0',
            enable: vi.fn(),
            disable: vi.fn(),
            setTracerProvider: (provider) => {
                instrumentedTracer = provider.getTracer('host-instrumentation');
            },
            setMeterProvider: vi.fn(),
            setConfig: vi.fn(),
            getConfig: () => ({ enabled: true }),
        };
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            extraInstrumentations: [instrumentation],
            traces: { enabled: true, samplingRatio: 1 },
        });

        // act
        instrumentedTracer?.startSpan('host-instrumented-operation').end();
        await sdk?.forceFlush();
        const names = exporter.getFinishedSpans().map((span) => span.name);
        await Promise.all([sdk?.shutdown(), sdk?.shutdown()]);

        // assert
        expect(names).toEqual(['host-instrumented-operation']);
        expect(instrumentation.disable).toHaveBeenCalledOnce();
    });

    it('retains an automatically started export after the provider queue has become empty', async () => {
        // arrange: SDK 3 starts its default 512-span batch before forceFlush is called.
        let finishExport: (() => void) | undefined;
        let finishTransport: (() => void) | undefined;
        let enteredTransport: (() => void) | undefined;
        const transportDone = new Promise<void>((resolve) => {
            finishTransport = resolve;
        });
        const transportEntered = new Promise<void>((resolve) => {
            enteredTransport = resolve;
        });
        const exporter: SpanExporter = {
            export: vi.fn((_spans, callback) => {
                finishExport = () => {
                    finishExport = undefined;
                    callback({ code: ExportResultCode.SUCCESS });
                    finishTransport?.();
                };
            }),
            forceFlush: vi.fn(() => {
                enteredTransport?.();
                return transportDone;
            }),
            shutdown: vi.fn().mockResolvedValue(undefined),
        };
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            traces: { enabled: true, samplingRatio: 1 },
        });
        const tracer = trace.getTracer('automatic-batch-test');
        for (let index = 0; index < 512; index++) tracer.startSpan('operation').end();
        let settled = false;

        // act
        const flushing = sdk?.forceFlush().then(() => {
            settled = true;
        });
        try {
            await Promise.race([transportEntered, flushing]);

            // assert: the batch has left the queue, but its transport still owns completion.
            expect(exporter.export).toHaveBeenCalledOnce();
            expect(exporter.forceFlush).toHaveBeenCalledOnce();
            expect(settled).toBe(false);
            finishExport?.();
            await flushing;
            expect(settled).toBe(true);
        } finally {
            finishExport?.();
            finishTransport?.();
            await sdk?.shutdown();
        }
    });

    it('propagates a host transport flush failure and clears the lifecycle deadline', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        const failure = new Error('test-only-transport-flush-failure');
        const transport = vi.spyOn(exporter, 'forceFlush').mockRejectedValue(failure);
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            traces: { enabled: true },
        });
        vi.useFakeTimers();

        // act
        try {
            await expect(sdk?.forceFlush()).rejects.toBe(failure);

            // assert
            expect(vi.getTimerCount()).toBe(0);
        } finally {
            transport.mockRestore();
            await sdk?.shutdown();
        }
    });

    it('drains the host transport even when the provider queue flush fails', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        const transport = vi.spyOn(exporter, 'forceFlush');
        const failure = new Error('test-only-provider-flush-failure');
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            traces: { enabled: true },
        });
        vi.spyOn(TracerProvider.prototype, 'forceFlush').mockRejectedValue(failure);

        // act
        try {
            await expect(sdk?.forceFlush()).rejects.toBe(failure);

            // assert
            expect(transport).toHaveBeenCalledOnce();
        } finally {
            await sdk?.shutdown();
        }
    });

    it('bounds a stalled host transport flush within the original lifecycle deadline', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        const transport = vi.spyOn(exporter, 'forceFlush').mockImplementation(() => new Promise<void>(() => undefined));
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            traces: { enabled: true },
        });
        vi.useFakeTimers();

        // act
        try {
            const assertion = expect(sdk?.forceFlush(25)).rejects.toThrow('exceeded 25ms');
            await vi.advanceTimersByTimeAsync(25);
            await assertion;

            // assert
            expect(vi.getTimerCount()).toBe(0);
        } finally {
            transport.mockRestore();
            await sdk?.shutdown();
        }
    });

    it('bounds a stalled flush and clears its deadline timer', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            traces: { enabled: true },
        });
        vi.spyOn(TracerProvider.prototype, 'forceFlush').mockImplementation(() => new Promise<void>(() => undefined));
        vi.useFakeTimers();

        // act
        try {
            const assertion = expect(sdk?.forceFlush(25)).rejects.toThrow('exceeded 25ms');
            await vi.advanceTimersByTimeAsync(25);
            await assertion;

            // assert
            expect(vi.getTimerCount()).toBe(0);
        } finally {
            await sdk?.shutdown();
        }
    });

    it('cleans up host instrumentation and its provider when registration fails partway through', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        const exporterShutdown = vi.spyOn(exporter, 'shutdown');
        const log = vi.spyOn(diag, 'error').mockImplementation(() => undefined);
        const failure = new Error('test-only-instrumentation-registration-failure');
        const instrumentation: Instrumentation = {
            instrumentationName: 'test-only-instrumentation',
            instrumentationVersion: '1.0.0',
            enable: vi.fn(),
            disable: vi.fn(),
            setTracerProvider: () => {
                throw failure;
            },
            setMeterProvider: vi.fn(),
            setConfig: vi.fn(),
            getConfig: () => ({ enabled: true }),
        };

        // act
        const result = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            extraInstrumentations: [instrumentation],
            traces: { enabled: true },
        });

        // assert
        expect(result).toEqual({});
        expect(instrumentation.disable).toHaveBeenCalledOnce();
        expect(exporterShutdown).toHaveBeenCalledOnce();
        expect(log).toHaveBeenCalledWith('Failed to initialize OpenTelemetry SDK. Telemetry will be degraded.', failure);
    });

    it('bounds stalled shutdown and disables its asynchronous context manager', async () => {
        // arrange
        const exporter = new InMemorySpanExporter();
        vi.spyOn(exporter, 'shutdown').mockImplementation(() => new Promise<void>(() => undefined));
        const disable = vi.spyOn(AsyncLocalStorageContextManager.prototype, 'disable');
        const { sdk } = await initializeOtel({
            enabled: true,
            serviceName: 'host-service',
            resourceDetectors: [],
            spanExporter: exporter,
            traces: { enabled: true },
        });
        vi.useFakeTimers();

        // act
        const assertion = expect(sdk?.shutdown(25)).rejects.toThrow('exceeded 25ms');
        await vi.advanceTimersByTimeAsync(25);
        await assertion;

        // assert
        expect(disable).toHaveBeenCalledOnce();
        expect(vi.getTimerCount()).toBe(0);
    });
});
