/**
 * Reads one bounded page of provider history for an exact canonical object key.
 *
 * @public
 */
export interface IBlobObjectHistoryRequest {
    readonly key: string;
    /** The configured bucket. An unsupported alternate bucket is rejected. */
    readonly bucket?: string;
    readonly continuationToken?: string;
    /** Integer from 1 to 5,000; defaults to 1,000. */
    readonly maxKeys?: number;
    /** Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries. */
    readonly timeoutMs?: number;
    readonly abortSignal?: AbortSignal;
}
