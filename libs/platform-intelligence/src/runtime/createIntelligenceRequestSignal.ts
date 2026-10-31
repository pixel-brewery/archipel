/**
 * Creates a total-operation timeout signal and combines it with caller cancellation.
 *
 * @internal
 */
export function createIntelligenceRequestSignal(timeoutMs: number, abortSignal?: AbortSignal): AbortSignal {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);

    return abortSignal ? AbortSignal.any([abortSignal, timeoutSignal]) : timeoutSignal;
}
