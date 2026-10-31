/**
 * Creates a fetch implementation that bounds every provider setup request.
 *
 * A request that exceeds the budget rejects with a `TimeoutError`
 * `DOMException`, the same type that `AbortSignal.timeout()` produces.
 *
 * @internal
 */
export function createIntelligenceTimeoutFetch(timeoutMs: number): typeof fetch {
    return async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]): Promise<Response> => {
        const controller = new AbortController();
        const upstreamSignal = init?.signal;
        const abortFromUpstream = (): void => controller.abort(upstreamSignal?.reason);
        const timeout = setTimeout(() => controller.abort(new DOMException(`Provider request timed out after ${timeoutMs}ms.`, 'TimeoutError')), timeoutMs);

        if (upstreamSignal?.aborted) {
            abortFromUpstream();
        } else {
            upstreamSignal?.addEventListener('abort', abortFromUpstream, { once: true });
        }

        try {
            return await fetch(input, {
                ...init,
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
            upstreamSignal?.removeEventListener('abort', abortFromUpstream);
        }
    };
}
