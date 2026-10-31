---
applyTo: 'libs/**/*.ts'
name: 'Enterprise Platform Readiness'
description: 'Mandatory rules for building enterprise-grade, horizontally scalable, cloud-native platform libraries. Covers stateless design, resilience, observability, idempotency, graceful lifecycle, and configuration hygiene.'
---

# Enterprise Platform Readiness Standards

Every platform library in the Archipel monorepo **must** meet these enterprise-readiness requirements before it is considered production-grade. These rules apply on top of the existing backend coding standards and are enforced for all code under `libs/`.

---

## Table of Contents

- [1. Stateless Structure](#1-stateless-structure)
- [2. Idempotency](#2-idempotency)
- [3. Resilience & Circuit Breaking](#3-resilience--circuit-breaking)
- [4. Health Checks & Readiness](#4-health-checks--readiness)
- [5. Graceful Lifecycle Management](#5-graceful-lifecycle-management)
- [6. Configuration Hygiene](#6-configuration-hygiene)
- [7. Observability & Correlation](#7-observability--correlation)
- [8. Error Isolation & Library Boundaries](#8-error-isolation--library-boundaries)
- [9. Concurrency Safety](#9-concurrency-safety)
- [10. Secret Handling](#10-secret-handling)
- [11. Resource Bounding](#11-resource-bounding)
- [12. Backward Compatibility & Versioning](#12-backward-compatibility--versioning)
- [13. Enforcement Checklist](#13-enforcement-checklist)

---

## 1. Stateless Structure

Platform libraries run as **singleton providers** inside NestJS. In a horizontally scaled deployment (multiple pods / containers), **each instance is independent** - there is no shared memory between instances. Therefore:

### Mandatory Rules

- **No mutable per-request state in singleton providers.** Class fields must be limited to:
    - Injected dependencies (services, abstract bases, config)
    - Immutable configuration set once during `onModuleInit()`
    - Thread-safe caches with explicit TTL and bounded size
- **No user/session/request context stored in class fields.** Context like "current user", "current tenant", or "active session" must be passed as method parameters or accessed via a **request-scoped** mechanism (e.g., `AsyncLocalStorage`, NestJS `@Inject(REQUEST)`).
- **No lazy-initialized mutable singletons** without synchronization. If a field is `null` at construction and populated on first access, concurrent callers can trigger double initialization. Use one of:
    - Eager initialization in `onModuleInit()`
    - A shared `Promise` field (initialize-once pattern)
    - A factory provider that resolves the dependency before injection

### Patterns

```typescript
// ❌ BAD - mutable request-scoped state in singleton
@Injectable()
class AnalyticsClient {
    private _currentUser: IUser | null = null;

    public setUser(user: IUser): void {
        this._currentUser = user; // Leaks across requests!
    }
}

// ✅ GOOD - user context passed per call
@Injectable()
class AnalyticsClient {
    public trackEvent(user: IUser, event: string): void {
        // user is scoped to this call
    }
}
```

```typescript
// ❌ BAD - unsynchronized lazy init
@Injectable()
class TextGenerator {
    private _model: unknown = null;

    public async generate(prompt: string): Promise<string> {
        if (!this._model) {
            this._model = await this.loadModel(); // Race condition!
        }
        return this._model.run(prompt);
    }
}

// ✅ GOOD - initialize-once via shared Promise
@Injectable()
class TextGenerator implements OnModuleInit {
    private _modelPromise!: Promise<unknown>;

    public onModuleInit(): void {
        this._modelPromise = this.loadModel();
    }

    public async generate(prompt: string): Promise<string> {
        const model = await this._modelPromise;
        return model.run(prompt);
    }
}
```

### What Counts as Acceptable State

| Acceptable                                 | Not Acceptable                                  |
| ------------------------------------------ | ----------------------------------------------- |
| Injected readonly dependencies             | Mutable user/session/tenant context             |
| Config values set once in `onModuleInit()` | Lazy-loaded SDK clients without synchronization |
| Bounded LRU caches with TTL                | Unbounded Maps/Arrays that grow indefinitely    |
| Prometheus/OpenTelemetry metric counters   | Raw numeric counters on class fields            |

---

## 2. Idempotency

Every write operation that crosses a network boundary **must** be idempotent or explicitly documented as non-idempotent.

### Mandatory Rules

- **External API mutations** (create checkout session, send envelope, deliver email) **must** include an idempotency key when the provider API supports it.
- Idempotency keys are generated **by the caller** (typically `crypto.randomUUID()`) and passed through the abstract base method signature.
- If the external API does not support idempotency keys natively, the library **must** document this limitation in TSDoc and recommend that the consuming application implements deduplication at the persistence layer.
- **Fire-and-forget side effects** (analytics events, non-critical logging) are exempt but must be documented as such.

### Pattern

```typescript
// Abstract base contract enforces idempotency key
export abstract class PaymentClientBase {
    /**
     * Creates a checkout session.
     * @param options - Checkout options including line items.
     * @param idempotencyKey - Caller-generated UUID to prevent duplicate sessions.
     */
    public abstract createCheckoutSession(options: ICheckoutOptions, idempotencyKey: string): Promise<ICheckoutSession>;
}
```

---

## 3. Resilience & Circuit Breaking

All outbound I/O (HTTP calls, SDK operations, external services) **must** be resilient against transient failures.

### Mandatory Rules

- **Timeout**: Every external call must define an explicit timeout (`≤ 5000 ms` default, configurable).
- **Retry with exponential backoff**: Retriable failures (network errors, 429, 503) must be retried up to a configurable maximum (default: 2 retries). Use exponential backoff with jitter.
- **Circuit breaker**: Providers that call external APIs **should** implement a circuit breaker (open after N consecutive failures, half-open probe after cooldown). At minimum, document circuit-breaker readiness in the abstract base's TSDoc.
- **Fallback / graceful degradation**: When a non-critical external service fails (analytics, telemetry), the library **must** degrade gracefully (noop, log, continue). It **must not** crash the request.
- **Never bubble raw provider errors**: Catch SDK/transport failures and wrap them in typed errors owned by the platform library.

### Pattern

```typescript
// Resilient external call
private async callWithResilience<T>(
    operation: () => Promise<T>,
    context: string,
): Promise<T> {
    const maxRetries = 2;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: unknown) {
            lastError = error;
            if (!this.isRetriable(error) || attempt === maxRetries) break;
            await this.backoff(attempt);
        }
    }

    throw new ExternalServiceError(context, lastError);
}
```

---

## 4. Health Checks & Readiness

Every library that performs I/O **must** expose a health indicator.

### Mandatory Rules

- If the library connects to an external service (database, cache, blob storage, payment provider, esigning provider, AI provider, analytics backend), it **must** provide a class implementing `IHealthIndicator`.
- The health indicator **must** be registered with `HealthOrchestrator` via a bootstrap provider (follow the existing pattern from `platform-blob-storage` and `platform-database`).
- Health checks **must** be lightweight (ping/status endpoint, not full operation).
- Health checks **must** have their own timeout (`≤ 3000 ms`) independent of the service's operational timeout.

### Libraries That Require Health Indicators

| Library                 | Required            | Reason                     |
| ----------------------- | ------------------- | -------------------------- |
| `platform-database`     | ✅ Exists           | Prisma connection          |
| `platform-blob-storage` | ✅ Exists           | Blob endpoint              |
| `platform-mailing`      | ✅ Exists (partial) | SMTP/provider connectivity |
| `platform-caching`      | ❌ **Missing**      | Redis connection           |
| `platform-payments`     | ❌ **Missing**      | Payment provider API       |
| `platform-esigning`     | ❌ **Missing**      | Esigning provider API      |
| `platform-intelligence` | ❌ **Missing**      | LLM provider API           |
| `platform-analytics`    | ❌ **Missing**      | Analytics backend          |

---

## 5. Graceful Lifecycle Management

Libraries that hold connections, file handles, or background tasks **must** implement proper lifecycle hooks.

### Mandatory Rules

- **Startup**: Heavy initialization (loading templates, establishing connections, warming caches) belongs in `onModuleInit()`, not in constructors or lazy getters.
- **Shutdown**: Implement `OnModuleDestroy` or `OnApplicationShutdown` to:
    - Close open connections (database, Redis, HTTP clients)
    - Flush pending buffers (analytics, telemetry, logs)
    - Cancel in-flight timers or intervals
    - Drain active transport sessions (MCP, SSE)
- **Order**: Shutdown hooks run in reverse dependency order. Libraries should not assume other libraries are still available during their shutdown.
- **Timeout**: Shutdown logic must complete within a reasonable time (`≤ 10 s`). Use `Promise.race` with a timeout if the underlying SDK does not guarantee timely shutdown.

### Pattern

```typescript
@Injectable()
class ExternalClient implements OnModuleInit, OnModuleDestroy {
    private _client!: SdkClient;

    public async onModuleInit(): Promise<void> {
        this._client = await SdkClient.create(this._config);
    }

    public async onModuleDestroy(): Promise<void> {
        await Promise.race([this._client.close(), new Promise((_, reject) => setTimeout(() => reject(new Error('Shutdown timeout')), 5000))]);
    }
}
```

---

## 6. Configuration Hygiene

### Mandatory Rules

- **No `process.env` access** outside `platform-configuration`. All config values flow through `ConfigService`.
- **Typed config keys only**: Use `createConfigKey<T>()` for every config value. No inline magic strings like `configService.get<string>('MY_KEY')`.
- **Startup validation**: Every module's `register()` / `forRoot()` **must** validate that required config entries are present and correctly typed **during module initialization** - not on first use at runtime. Missing critical config should cause a fast, loud failure at startup.
- **Config entries array**: Every provider subpath exports a `{PROVIDER}_CONFIG_ENTRIES` array. This array is the single source of truth for what the provider needs.
- **Defaults**: Non-critical config values should have sensible defaults documented in the config entry's `description` field.

### Pattern

```typescript
// ❌ BAD - raw process.env + magic string
const secret = process.env['STRIPE_SECRET'];

// ❌ BAD - magic string in configService call
const secret = this._configService.get<string>('STRIPE_SECRET');

// ✅ GOOD - typed config key
import { STRIPE_API_KEY } from './env';
const secret = this._configService.get(STRIPE_API_KEY);
```

---

## 7. Observability & Correlation

### Mandatory Rules

- **Structured logging**: All log entries **must** include:
    - `requestId` (correlation ID, propagated via `AsyncLocalStorage` or request header)
    - `module` (library name)
    - `operation` (method/action name)
    - `duration` (for I/O operations)
- **No silent catches**: Every `catch` block must either:
    - Re-throw a typed error owned by the library, or
    - Log at `warn` or `error` level with context
    - `catch () { /* noop */ }` is **forbidden** in production code paths. The only exception is `onModuleDestroy` cleanup where failure is truly irrelevant.
- **Metrics**: Libraries performing external I/O should expose counters/histograms:
    - `external_request_total{library, provider, operation, status}`
    - `external_request_duration_ms{library, provider, operation}`
    - `health_check_status{library, provider}`
- **Tracing**: When `platform-telemetry` is available, external calls should create child spans with provider/operation attributes.

### Pattern

```typescript
// ❌ BAD - silent catch
try {
    await this.updateSession(userId);
} catch {
    /* silent fail */
}

// ✅ GOOD - logged with context
try {
    await this.updateSession(userId);
} catch (error: unknown) {
    this._logger.warn('Session update failed', {
        userId,
        requestId,
        error: error instanceof Error ? error.message : 'Unknown',
    });
}
```

---

## 8. Error Isolation & Library Boundaries

### Mandatory Rules

- **Platform errors at library boundaries**: Libraries expose typed, library-owned errors (e.g., `PaymentError`, `EsigningError`). Do not expose raw SDK errors. HTTP-facing libraries may expose `ProblemDetailException` subclasses.
- **Error wrapping at the boundary**: Every adapter/client must catch provider-specific errors and wrap them in the library's own error types.
- **No implementation leaks**: Error messages must not include internal SDK details, stack traces from third-party libraries, or provider-specific error codes that the consumer cannot act on.
- **Error classification**: Platform errors should include a machine-readable `code` property for programmatic handling and a human-readable `message` for logging.

### Pattern

```typescript
// ❌ BAD - leaks Stripe internals
throw error; // raw StripeCardError

// ✅ GOOD - wrapped in a library-owned error
throw new PaymentDeclinedError('Card was declined by the issuer.', { providerCode: error.decline_code });
```

---

## 9. Concurrency Safety

### Mandatory Rules

- **No shared mutable collections** without synchronization. If a `Map`, `Set`, or `Array` is mutated after initialization, it must be:
    - Replaced atomically (copy-on-write), or
    - Protected by a mutex/lock, or
    - Moved into a request-scoped provider
- **Lazy initialization must be safe**: Use the "shared Promise" pattern (assign the `Promise` to a field on first call; subsequent callers `await` the same `Promise`).
- **Event listeners**: Avoid registering new listeners on every request. Register once in `onModuleInit()` and dispatch via the event.

### Pattern

```typescript
// ✅ GOOD - safe lazy initialization via shared Promise
@Injectable()
class LazyClient implements OnModuleInit {
    private _initPromise: Promise<SdkClient> | null = null;

    private getClient(): Promise<SdkClient> {
        if (!this._initPromise) {
            this._initPromise = this.createClient();
        }
        return this._initPromise;
    }
}
```

---

## 10. Secret Handling

### Mandatory Rules

- **No secrets in code**: API keys, tokens, passwords, and connection strings are read exclusively via `ConfigService`.
- **No secrets in logs**: Logger utilities must mask fields named `password`, `token`, `secret`, `apiKey`, `authorization`, `credential`, and similar. Use the existing `HttpLoggerMiddleware` masking pattern.
- **No secrets in error messages**: Platform errors must strip credentials from context before including provider error details.
- **No secrets in health checks**: Health indicators must not return connection strings, tokens, or credentials in their status output.
- **Test secrets**: Test files may contain fixture tokens/keys but must be clearly fake (`sk_test_FAKE`, `test-only-secret-do-not-use-in-production`).

---

## 11. Resource Bounding

### Mandatory Rules

- **Bounded collections**: Any in-memory collection that grows over time (caches, registries, transport lists) **must** have:
    - A maximum size (`maxEntries`, `maxSize`)
    - An eviction policy (LRU, TTL, FIFO)
    - Metrics on current size and eviction count
- **Bounded buffers**: If a library buffers data before flushing (analytics events, log entries), the buffer must have a maximum size and a flush interval. Exceeding the buffer size triggers an immediate flush.
- **Connection pooling**: Libraries that create connections (HTTP, DB, Redis) must use bounded pools with configurable limits.

### Pattern

```typescript
// ❌ BAD - unbounded list
private _activeTransports: Transport[] = [];

// ✅ GOOD - bounded with eviction
private readonly _activeTransports = new BoundedSet<Transport>(100, {
    onEvict: (transport) => transport.close(),
});
```

---

## 12. Backward Compatibility & Versioning

### Mandatory Rules

- **Semantic versioning**: All public API changes follow semver. Breaking changes require a major version bump.
- **Deprecation before removal**: Public methods and config keys are deprecated for at least one minor version before removal. Use `@deprecated` TSDoc tag.
- **Additive-only for minor versions**: New optional parameters, new methods, and new config keys are additive. Existing signatures must not change.
- **Abstract base stability**: Abstract abstract base classes are the primary stability contract. Adding a method to a abstract base is a **breaking change** (forces all adapters to implement it). Prefer adding optional methods via a secondary abstract base or mixin.

---

## 13. Enforcement Checklist

Every PR touching `libs/` code must verify:

```
[ ] No mutable request-scoped state in singleton providers
[ ] All external write operations have idempotency keys (or documented exemption)
[ ] All external calls have timeout + retry + error wrapping
[ ] Health indicator exists for every I/O-bound provider
[ ] onModuleInit() for startup, onModuleDestroy() for cleanup
[ ] All config via typed keys through ConfigService (no process.env, no magic strings)
[ ] Structured logging with requestId - no silent catches
[ ] Typed platform errors at library boundaries - no leaked SDK errors
[ ] No unsynchronized lazy initialization of shared state
[ ] No secrets in logs, errors, or health outputs
[ ] All in-memory collections bounded with eviction policy
[ ] No breaking changes without major version bump
```

---

**End of Enterprise Platform Readiness Standards**
