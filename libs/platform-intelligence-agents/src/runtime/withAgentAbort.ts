import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';

/**
 * Bounds adapters even when an implementation fails to settle after cancellation.
 *
 * @internal
 * @param operation - Already-started operation whose wait must respect cancellation.
 * @param signal - Cancellation signal for the active invocation.
 * @param loopId - Identifier of the active or paused loop.
 * @returns The operation result when it settles before cancellation.
 * @throws {AgentRuntimeError} When cancellation wins the race with the operation.
 */
export async function withAgentAbort<T>(operation: PromiseLike<T>, signal: AbortSignal, loopId?: string): Promise<T> {
    let abort: () => void = () => undefined;
    const cancelled = new Promise<never>((_resolve, reject) => {
        abort = () => reject(new AgentRuntimeError('RUN_ABORTED', 'Agent operation was cancelled or timed out.', loopId));
        if (signal.aborted) {
            abort();
        } else {
            signal.addEventListener('abort', abort, { once: true });
        }
    });
    try {
        return await Promise.race([cancelled, operation]);
    } finally {
        signal.removeEventListener('abort', abort);
    }
}
