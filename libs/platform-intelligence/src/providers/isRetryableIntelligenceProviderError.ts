/**
 * Structured fields of a provider failure or one of its causes.
 */
interface IProviderFailureShape {
    readonly name?: unknown;
    readonly code?: unknown;
    readonly status?: unknown;
    readonly statusCode?: unknown;
    readonly isRetryable?: unknown;
    readonly cause?: unknown;
    readonly lastError?: unknown;
}

/**
 * Error names of a provider request that was aborted or timed out.
 *
 * `TimeoutError` is the reason of `AbortSignal.timeout()` and of the provider
 * request budget. `AbortError` also ends a provider SDK retry wait that a
 * timeout interrupted.
 */
const RETRYABLE_ERROR_NAMES: ReadonlySet<string> = new Set(['AbortError', 'TimeoutError']);

/**
 * Node.js and undici codes of transient network failures.
 */
const RETRYABLE_ERROR_CODES: ReadonlySet<string> = new Set([
    'EAI_AGAIN',
    'ECONNABORTED',
    'ECONNREFUSED',
    'ECONNRESET',
    'EPIPE',
    'ETIMEDOUT',
    'UND_ERR_BODY_TIMEOUT',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_SOCKET',
]);

/**
 * HTTP statuses of transient provider responses besides every `5xx` status.
 */
const RETRYABLE_HTTP_STATUSES: ReadonlySet<number> = new Set([408, 429]);

/**
 * Determines whether an intelligence provider failure is transient.
 *
 * The decision reads the error name, network code, and HTTP status of the
 * failure, of its `cause` chain, and of the last attempt of a provider SDK
 * retry error. Provider message text is never interpreted.
 *
 * @internal
 */
export function isRetryableIntelligenceProviderError(error: unknown): boolean {
    const inspected = new Set<object>();
    const pending: unknown[] = [error];

    while (pending.length > 0) {
        const failure = pending.shift();
        if (typeof failure !== 'object' || failure === null || inspected.has(failure)) {
            continue;
        }

        inspected.add(failure);
        const shape = failure as IProviderFailureShape;
        if (typeof shape.isRetryable === 'boolean') {
            return shape.isRetryable;
        }

        if (isTransientFailure(shape)) {
            return true;
        }

        pending.push(shape.lastError, shape.cause);
    }

    return false;
}

function isTransientFailure(failure: IProviderFailureShape): boolean {
    if (typeof failure.name === 'string' && RETRYABLE_ERROR_NAMES.has(failure.name)) {
        return true;
    }

    if (typeof failure.code === 'string' && RETRYABLE_ERROR_CODES.has(failure.code)) {
        return true;
    }

    const status = typeof failure.statusCode === 'number' ? failure.statusCode : failure.status;

    return typeof status === 'number' && (RETRYABLE_HTTP_STATUSES.has(status) || (status >= 500 && status <= 599));
}
