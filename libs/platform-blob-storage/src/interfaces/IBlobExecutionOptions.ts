/**
 * Requests a provider-enforced deadline and optional caller cancellation.
 *
 * A strategy must explicitly support these options; they may never be silently
 * ignored. Cancellation cannot undo a mutation already accepted by the provider.
 *
 * @public
 */
export interface IBlobExecutionOptions {
    /** Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries and body consumption. */
    readonly timeoutMs?: number;
    readonly abortSignal?: AbortSignal;
}
