import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { context, ROOT_CONTEXT, type Span, SpanStatusCode, trace, type Tracer } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { InMemorySpanExporter, SimpleSpanProcessor, TracerProvider } from '@opentelemetry/sdk-trace';
import { Observable, type Subscriber } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProviderInstrumentation } from './ProviderInstrumentation.js';

describe('Nest provider method traces', () => {
    let exporter: InMemorySpanExporter;
    let provider: TracerProvider;
    let tracer: Tracer;

    beforeEach(() => {
        context.setGlobalContextManager(new AsyncLocalStorageContextManager().enable());
        exporter = new InMemorySpanExporter();
        provider = new TracerProvider({ spanProcessors: [new SimpleSpanProcessor({ exporter })] });
        trace.setGlobalTracerProvider(provider);
        tracer = trace.getTracer('provider-instrumentation-test');
    });

    afterEach(async () => {
        await provider.shutdown();
        context.disable();
        trace.disable();
        vi.restoreAllMocks();
    });

    const exportedData = () =>
        JSON.stringify(exporter.getFinishedSpans().map(({ name, attributes, status, events, links }) => ({ name, attributes, status, events, links })));

    it('uses the public Nest hook to retain controller, service and repository parentage across awaits', async () => {
        // arrange
        class OrderRepository {
            #value = 7;
            public async read(): Promise<number> {
                await Promise.resolve();
                return this.#value;
            }
        }
        class OrderService {
            public constructor(private readonly _repository: OrderRepository) {}
            public async load(): Promise<number> {
                await Promise.resolve();
                return this._repository.read();
            }
        }
        class OrderController {
            public constructor(private readonly _service: OrderService) {}
            public handle(): Promise<number> {
                return this._service.load();
            }
        }
        class AppModule {}
        Module({
            providers: [
                OrderRepository,
                { provide: OrderService, inject: [OrderRepository], useFactory: (repository: OrderRepository) => new OrderService(repository) },
                { provide: OrderController, inject: [OrderService], useFactory: (service: OrderService) => new OrderController(service) },
            ],
        })(AppModule);
        const instrumentation = new ProviderInstrumentation({
            include: (instance) => instance instanceof OrderController || instance instanceof OrderService || instance instanceof OrderRepository,
        });
        const app = await NestFactory.createApplicationContext(AppModule, {
            logger: false,
            instrument: { instanceDecorator: instrumentation.instanceDecorator },
        });

        // act
        let result: number;
        try {
            result = await tracer.startActiveSpan('http-request', async (root) => {
                try {
                    return await app.get(OrderController).handle();
                } finally {
                    root.end();
                }
            });
        } finally {
            await app.close();
        }
        await provider.forceFlush();

        // assert
        const spans = exporter.getFinishedSpans();
        expect(result).toBe(7);
        expect(spans.map((span) => span.name).sort()).toEqual(['OrderController.handle', 'OrderRepository.read', 'OrderService.load', 'http-request']);
        for (const [childName, parentName] of [
            ['OrderController.handle', 'http-request'],
            ['OrderService.load', 'OrderController.handle'],
            ['OrderRepository.read', 'OrderService.load'],
        ]) {
            expect(spans.find((span) => span.name === childName)?.parentSpanContext).toEqual(spans.find((span) => span.name === parentName)?.spanContext());
        }
    });

    it('keeps concurrent asynchronous calls in their own active trace', async () => {
        // arrange
        class ConcurrentRepository {
            public read(value: number): number {
                return value;
            }
        }
        class ConcurrentService {
            public constructor(private readonly _repository: ConcurrentRepository) {}
            public async load(value: number): Promise<number> {
                await Promise.resolve();
                return this._repository.read(value);
            }
        }
        const instrumentation = new ProviderInstrumentation({ include: () => true });
        const repository = new ConcurrentRepository();
        instrumentation.instanceDecorator(repository);
        const service = new ConcurrentService(repository);
        instrumentation.instanceDecorator(service);

        // act
        const results = await Promise.all(
            [1, 2].map((value) =>
                tracer.startActiveSpan(`request-${value}`, async (root) => {
                    try {
                        return await service.load(value);
                    } finally {
                        root.end();
                    }
                }),
            ),
        );
        await provider.forceFlush();

        // assert
        expect(results).toEqual([1, 2]);
        const spans = exporter.getFinishedSpans();
        for (const root of spans.filter((span) => span.name.startsWith('request-'))) {
            const related = spans.filter((span) => span.spanContext().traceId === root.spanContext().traceId);
            const serviceSpan = related.find((span) => span.name === 'ConcurrentService.load');
            const repositorySpan = related.find((span) => span.name === 'ConcurrentRepository.read');
            expect(related).toHaveLength(3);
            expect(serviceSpan?.parentSpanContext).toEqual(root.spanContext());
            expect(repositorySpan?.parentSpanContext).toEqual(serviceSpan?.spanContext());
        }
    });

    it('preserves instance identity, private receivers, getters, native methods and method metadata', async () => {
        // arrange
        let getterReads = 0;
        class PrivateProvider extends Map<string, number> {
            #value: number;
            public constructor(value: number) {
                super();
                this.#value = value;
            }
            public get value(): number {
                getterReads++;
                return this.#value;
            }
            public read(): number {
                return this.#value;
            }
            public self(): this {
                return this;
            }
        }
        const selected = new PrivateProvider(7);
        const other = new PrivateProvider(9);
        const metadata = { path: '/static-route' };
        Reflect.defineMetadata('route', metadata, PrivateProvider.prototype.read);
        const instrumentation = new ProviderInstrumentation({ include: () => true });
        const root = tracer.startSpan('request');

        // act
        const decorated = instrumentation.instanceDecorator(selected);
        const method = selected.read;
        instrumentation.instanceDecorator(selected);
        const observations = context.with(trace.setSpan(ROOT_CONTEXT, root), () => [selected.self(), selected.read(), selected.read.call(other)]);
        root.end();
        await provider.forceFlush();

        // assert
        expect(decorated).toBe(selected);
        expect(observations).toEqual([selected, 7, 9]);
        expect(selected.read).toBe(method);
        expect(selected.set).toBe(Map.prototype.set);
        expect(Reflect.getMetadata('route', selected.read)).toBe(metadata);
        expect(getterReads).toBe(0);
        expect(selected.value).toBe(7);
        expect(getterReads).toBe(1);
        expect(
            exporter
                .getFinishedSpans()
                .map((span) => span.name)
                .sort(),
        ).toEqual(['PrivateProvider.read', 'PrivateProvider.read', 'PrivateProvider.self', 'request']);
    });

    it.each(['synchronous', 'asynchronous'] as const)('preserves the %s failure without recording its message, stack or payload', async (mode) => {
        // arrange
        const failure = new Error('private-password-and-row-data');
        class FailingProvider {
            public fail(): unknown {
                if (mode === 'asynchronous') return Promise.reject(failure);
                throw failure;
            }
        }
        const selected = new FailingProvider();
        new ProviderInstrumentation({ include: () => true }).instanceDecorator(selected);

        // act
        const result = tracer.startActiveSpan('request', async (root) => {
            try {
                return await selected.fail();
            } finally {
                root.end();
            }
        });
        await expect(result).rejects.toBe(failure);
        await provider.forceFlush();

        // assert
        const span = exporter.getFinishedSpans().find((entry) => entry.name === 'FailingProvider.fail');
        expect(span?.status).toEqual({ code: SpanStatusCode.ERROR });
        expect(span?.attributes['error.type']).toBe('Error');
        expect(span?.events).toEqual([]);
        expect(exportedData()).not.toContain('private-password-and-row-data');
    });

    it('accepts only bounded machine-readable failure attributes from the host classifier', async () => {
        // arrange
        const failure = new Error('private error detail');
        class ClassifiedProvider {
            public run(): never {
                throw failure;
            }
        }
        const selected = new ClassifiedProvider();
        const classifyFailure = vi.fn(() => ({
            'error.type': 'DatabaseError',
            'error.code': 'P2028',
            'cause.code': 'P2028',
            'http.response.status_code': '500',
            'failure.kind': 'x'.repeat(129),
            'exception.message': 'private error detail',
        }));
        new ProviderInstrumentation({ include: () => true, classifyFailure }).instanceDecorator(selected);
        const root = tracer.startSpan('request');

        // act
        expect(() => context.with(trace.setSpan(ROOT_CONTEXT, root), () => selected.run())).toThrow(failure);
        root.end();
        await provider.forceFlush();

        // assert
        expect(classifyFailure).toHaveBeenCalledExactlyOnceWith(failure);
        const span = exporter.getFinishedSpans().find((entry) => entry.name === 'ClassifiedProvider.run');
        expect(span?.attributes).toEqual({
            'nestjs.provider.name': 'ClassifiedProvider',
            'code.function.name': 'run',
            'error.type': 'DatabaseError',
            'error.code': 'P2028',
            'cause.code': 'P2028',
            'http.response.status_code': '500',
        });
        expect(exportedData()).not.toContain('private error detail');
    });

    it('keeps the original thrown value when the host classifier fails', async () => {
        // arrange
        const failure = { privateData: 'never-export' };
        class FailureProvider {
            public run(): never {
                throw failure;
            }
        }
        const selected = new FailureProvider();
        const recordFailure = vi.fn((span: Span) => span.addEvent('safe-failure'));
        new ProviderInstrumentation({
            include: () => true,
            recordFailure,
            classifyFailure: () => {
                throw new Error('private classifier failure');
            },
        }).instanceDecorator(selected);
        const root = tracer.startSpan('request');

        // act
        let caught: unknown;
        try {
            context.with(trace.setSpan(ROOT_CONTEXT, root), () => selected.run());
        } catch (error: unknown) {
            caught = error;
        }
        root.end();
        await provider.forceFlush();

        // assert
        expect(caught).toBe(failure);
        const span = exporter.getFinishedSpans().find((entry) => entry.name === 'FailureProvider.run');
        expect(span?.status.code).toBe(SpanStatusCode.ERROR);
        expect(span?.attributes['error.type']).toBe('unknown');
        expect(recordFailure).toHaveBeenCalledExactlyOnceWith(expect.anything(), failure);
        expect(span?.events.map((event) => event.name)).toEqual(['safe-failure']);
        expect(exportedData()).not.toMatch(/never-export|private classifier/);
    });

    it('allows host-sanitized exception events only on failed spans', async () => {
        // arrange
        const failure = new Error('private message that must remain local');
        class EnrichedProvider {
            public run(failed: boolean): number {
                if (failed) throw failure;
                return 7;
            }
        }
        const selected = new EnrichedProvider();
        const recordFailure = vi.fn((span: Span) => {
            span.addEvent('exception', {
                'exception.type': 'SafeError',
                'exception.stacktrace': 'at EnrichedProvider.run (src/EnrichedProvider.ts:10:2)',
            });
        });
        new ProviderInstrumentation({ include: () => true, recordFailure }).instanceDecorator(selected);
        const root = tracer.startSpan('request');

        // act
        const result = context.with(trace.setSpan(ROOT_CONTEXT, root), () => {
            const value = selected.run(false);
            expect(() => selected.run(true)).toThrow(failure);
            return value;
        });
        root.end();
        await provider.forceFlush();

        // assert
        expect(result).toBe(7);
        expect(recordFailure).toHaveBeenCalledExactlyOnceWith(expect.anything(), failure);
        const failed = exporter.getFinishedSpans().find((span) => span.status.code === SpanStatusCode.ERROR);
        expect(failed?.events[0]?.attributes).toEqual({
            'exception.type': 'SafeError',
            'exception.stacktrace': 'at EnrichedProvider.run (src/EnrichedProvider.ts:10:2)',
        });
        expect(exportedData()).not.toContain('private message');
    });

    it('preserves the original rejection and ends the span when host enrichment fails', async () => {
        // arrange
        const failure = new Error('private application failure');
        class EnrichmentFailureProvider {
            public run(): Promise<never> {
                return Promise.reject(failure);
            }
        }
        const selected = new EnrichmentFailureProvider();
        new ProviderInstrumentation({
            include: () => true,
            classifyFailure: () => ({ 'error.code': 'SAFE_CODE' }),
            recordFailure: () => {
                throw new Error('private hook failure');
            },
        }).instanceDecorator(selected);

        // act
        const result = tracer.startActiveSpan('request', async (root) => {
            try {
                return await selected.run();
            } finally {
                root.end();
            }
        });
        await expect(result).rejects.toBe(failure);
        await provider.forceFlush();

        // assert
        const span = exporter.getFinishedSpans().find((entry) => entry.name === 'EnrichmentFailureProvider.run');
        expect(span?.status.code).toBe(SpanStatusCode.ERROR);
        expect(span?.attributes['error.code']).toBe('SAFE_CODE');
        expect(span?.events).toEqual([]);
        expect(exportedData()).not.toMatch(/private application|private hook/);
    });

    it('requires an active recording parent and never decorates the bridge itself', async () => {
        // arrange
        class SelectedProvider {
            public run(): number {
                return 7;
            }
        }
        const selected = new SelectedProvider();
        const instrumentation = new ProviderInstrumentation({ include: () => true });
        instrumentation.instanceDecorator(selected);
        const hook = instrumentation.instanceDecorator;
        const nonRecording = trace.wrapSpanContext({ traceId: '1'.repeat(32), spanId: '2'.repeat(16), traceFlags: 0 });

        // act
        const outside = selected.run();
        const unsampled = context.with(trace.setSpan(ROOT_CONTEXT, nonRecording), () => selected.run());
        instrumentation.instanceDecorator(instrumentation);
        await provider.forceFlush();

        // assert
        expect([outside, unsampled]).toEqual([7, 7]);
        expect(instrumentation.instanceDecorator).toBe(hook);
        expect(exporter.getFinishedSpans()).toEqual([]);
    });

    it('preserves a provider whose proxy rejects prototype inspection', () => {
        // arrange
        const selected = new Proxy(
            {},
            {
                getPrototypeOf: () => {
                    throw new Error('private proxy detail');
                },
            },
        );
        const instrumentation = new ProviderInstrumentation({ include: () => true });

        // act
        const result = instrumentation.instanceDecorator(selected);

        // assert
        expect(result).toBe(selected);
        expect(exporter.getFinishedSpans()).toEqual([]);
    });

    it('returns a custom thenable untouched without reading its then property', async () => {
        // arrange
        let reads = 0;
        const thenable = Object.defineProperty({}, 'then', {
            get: () => {
                reads++;
                return (resolve: (value: number) => void) => resolve(7);
            },
        });
        class ThenableProvider {
            public run(): unknown {
                return thenable;
            }
        }
        const selected = new ThenableProvider();
        new ProviderInstrumentation({ include: () => true }).instanceDecorator(selected);
        const root = tracer.startSpan('request');

        // act
        const result = context.with(trace.setSpan(ROOT_CONTEXT, root), () => selected.run());
        root.end();
        await provider.forceFlush();

        // assert
        expect(result).toBe(thenable);
        expect(reads).toBe(0);
        expect(
            exporter
                .getFinishedSpans()
                .map((span) => span.name)
                .sort(),
        ).toEqual(['ThenableProvider.run', 'request']);
    });

    it('preserves custom promise identity and does not invoke an overridden then method', async () => {
        // arrange
        class CustomPromise extends Promise<number> {}
        const promise = CustomPromise.resolve(7);
        const then = vi.spyOn(promise, 'then');
        class PromiseProvider {
            public run(): CustomPromise {
                return promise;
            }
        }
        const selected = new PromiseProvider();
        new ProviderInstrumentation({ include: () => true }).instanceDecorator(selected);
        const root = tracer.startSpan('request');

        // act
        const result = context.with(trace.setSpan(ROOT_CONTEXT, root), () => selected.run());
        root.end();
        await provider.forceFlush();

        // assert
        expect(result).toBe(promise);
        expect(then).not.toHaveBeenCalled();
        expect(
            exporter
                .getFinishedSpans()
                .map((span) => span.name)
                .sort(),
        ).toEqual(['PromiseProvider.run', 'request']);
    });

    it.each(['complete', 'error', 'unsubscribe'] as const)('preserves Observable identity, multiple emissions and %s behavior', async (termination) => {
        // arrange
        const subscribers: Subscriber<number>[] = [];
        let released = 0;
        const source = new Observable<number>((subscriber) => {
            subscribers.push(subscriber);
            return () => released++;
        });
        class StreamProvider {
            public stream(): Observable<number> {
                return source;
            }
        }
        const selected = new StreamProvider();
        new ProviderInstrumentation({ include: () => true }).instanceDecorator(selected);
        const root = tracer.startSpan('request');
        const values: number[] = [];
        const failure = new Error('private stream detail');
        const errors: unknown[] = [];

        // act
        const result = context.with(trace.setSpan(ROOT_CONTEXT, root), () => selected.stream());
        const subscriptionsBeforeConsumer = subscribers.length;
        const subscription = result.subscribe({ next: (value) => values.push(value), error: (error: unknown) => errors.push(error) });
        subscribers[0]?.next(1);
        subscribers[0]?.next(2);
        if (termination === 'complete') subscribers[0]?.complete();
        if (termination === 'error') subscribers[0]?.error(failure);
        if (termination === 'unsubscribe') subscription.unsubscribe();
        root.end();
        await provider.forceFlush();

        // assert
        expect(result).toBe(source);
        expect(subscriptionsBeforeConsumer).toBe(0);
        expect(values).toEqual([1, 2]);
        expect(errors).toEqual(termination === 'error' ? [failure] : []);
        expect(released).toBe(1);
        expect(subscription.closed).toBe(true);
        const span = exporter.getFinishedSpans().find((entry) => entry.name === 'StreamProvider.stream');
        expect(span?.status.code).toBe(SpanStatusCode.UNSET);
        expect(exportedData()).not.toContain('private stream detail');
    });
});
