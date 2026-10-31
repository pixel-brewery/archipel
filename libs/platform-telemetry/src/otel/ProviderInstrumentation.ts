import { context, diag, type Span, SpanStatusCode, trace } from '@opentelemetry/api';
import { types } from 'node:util';

/** Adds provider method spans through Nest's public instance-decorator bootstrap hook. */
export class ProviderInstrumentation {
    // #region Fields

    /** Pass this bound callback to Nest's `instrument.instanceDecorator` option. */
    public readonly instanceDecorator = (instance: unknown): unknown => this.decorate(instance);

    private readonly _decorated = new WeakSet<object>();
    private readonly _tracer = trace.getTracer('@pixel-brewery/archipel-platform-telemetry/providers');
    private readonly _include: (instance: object) => boolean;
    private readonly _classifyFailure?: (error: unknown) => Readonly<Record<string, string>>;
    private readonly _recordFailure?: (span: Span, error: unknown) => void;

    // #endregion

    // #region Ctor

    /**
     * @param options - Explicit provider selection and optional safe error classification.
     * The classifier may return `error.type`, `failure.kind`, `error.code`, `cause.code`
     * and `http.response.status_code`; only bounded machine-readable values are retained.
     * The synchronous `recordFailure` hook may enrich failed spans with host-sanitized exception events;
     * the host owns the enrichment's privacy and size limits.
     */
    public constructor(options: {
        readonly include: (instance: object) => boolean;
        readonly classifyFailure?: (error: unknown) => Readonly<Record<string, string>>;
        readonly recordFailure?: (span: Span, error: unknown) => void;
    }) {
        this._include = options.include;
        this._classifyFailure = options.classifyFailure;
        this._recordFailure = options.recordFailure;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    private decorate(instance: unknown): unknown {
        if (!instance || typeof instance !== 'object') return instance;
        try {
            if (instance instanceof ProviderInstrumentation || this._decorated.has(instance) || !this._include(instance) || !Object.isExtensible(instance))
                return instance;
            const prototype: unknown = Object.getPrototypeOf(instance);
            if (!prototype || prototype === Object.prototype) return instance;
            const constructor: unknown = Object.getOwnPropertyDescriptor(prototype, 'constructor')?.value;
            const name: unknown = typeof constructor === 'function' ? Object.getOwnPropertyDescriptor(constructor, 'name')?.value : undefined;
            if (typeof name !== 'string' || !/^[A-Za-z_$][A-Za-z0-9_$]{0,127}$/.test(name)) return instance;

            this._decorated.add(instance);
            const seen = new Set<string>();
            let owner: object | null = instance;
            for (let depth = 0; owner && owner !== Object.prototype && depth < 16 && seen.size < 128; depth++) {
                for (const key of Object.getOwnPropertyNames(owner)) {
                    if (seen.size >= 128) break;
                    if (seen.has(key)) continue;
                    seen.add(key);
                    if (['constructor', 'then', 'toString', 'toJSON', 'valueOf'].includes(key) || !/^[A-Za-z_$][A-Za-z0-9_$]{0,127}$/.test(key)) continue;
                    const descriptor = Object.getOwnPropertyDescriptor(owner, key);
                    const original: unknown = descriptor?.value;
                    if (!descriptor?.configurable || typeof original !== 'function' || Function.prototype.toString.call(original).includes('[native code]'))
                        continue;

                    // Only methods are decorated. The original receiver and instance identity remain intact.
                    const wrapped = new Proxy(original, {
                        apply: (target, receiver, args: unknown[]) => this.invoke(() => Reflect.apply(target, receiver, args), `${name}.${key}`, name, key),
                    });
                    for (const metadata of Reflect.getMetadataKeys(original)) {
                        Reflect.defineMetadata(metadata, Reflect.getMetadata(metadata, original), wrapped);
                    }
                    Object.defineProperty(instance, key, { ...descriptor, value: wrapped });
                }
                owner = Object.getPrototypeOf(owner) as object | null;
            }
        } catch {
            diag.warn('Provider instrumentation could not decorate an instance.');
        }
        return instance;
    }

    private invoke(callback: () => unknown, name: string, provider: string, method: string): unknown {
        const parent = context.active();
        if (!trace.getSpan(parent)?.isRecording()) return callback();

        let span: Span;
        try {
            span = this._tracer.startSpan(name, { attributes: { 'nestjs.provider.name': provider, 'code.function.name': method } }, parent);
        } catch {
            diag.warn('Provider instrumentation could not start a span.');
            return callback();
        }

        let result: unknown;
        try {
            result = context.with(trace.setSpan(parent, span), callback);
        } catch (error: unknown) {
            this.finish(span, true, error);
            throw error;
        }

        // Custom promises/thenables and Observables retain their exact identity and behavior.
        // Only ordinary native promises are observed beyond the synchronous invocation.
        try {
            if (
                types.isPromise(result) &&
                Object.getPrototypeOf(result) === Promise.prototype &&
                !Object.hasOwn(result, 'then') &&
                !Object.hasOwn(result, 'constructor')
            ) {
                return result.then(
                    (value: unknown) => {
                        this.finish(span);
                        return value;
                    },
                    (error: unknown) => {
                        this.finish(span, true, error);
                        throw error;
                    },
                );
            }
        } catch {
            diag.warn('Provider instrumentation could not observe an asynchronous result.');
        }
        this.finish(span);
        return result;
    }

    private finish(span: Span, failed = false, error?: unknown): void {
        try {
            if (failed) {
                span.setStatus({ code: SpanStatusCode.ERROR });
                span.setAttribute('error.type', error instanceof Error ? 'Error' : 'unknown');
                try {
                    const classification = this._classifyFailure?.(error);
                    for (const key of ['error.type', 'failure.kind', 'error.code', 'cause.code', 'http.response.status_code']) {
                        const value = classification?.[key];
                        if (typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,128}$/.test(value)) span.setAttribute(key, value);
                    }
                } catch {
                    diag.warn('Provider instrumentation could not classify a failure.');
                }
                try {
                    this._recordFailure?.(span, error);
                } catch {
                    diag.warn('Provider instrumentation could not enrich a failed span.');
                }
            }
        } catch {
            diag.warn('Provider instrumentation could not classify a failure.');
        } finally {
            try {
                span.end();
            } catch {
                diag.warn('Provider instrumentation could not end a span.');
            }
        }
    }

    // #endregion
}
