/**
 * Deletes only the object that still has the exact observed strong ETag.
 *
 * At most one version or snapshot selector may be supplied. Omitting both selects
 * the base object. Empty selectors, wildcard/weak/list ETags and alternate buckets
 * are rejected rather than broadening the deletion.
 *
 * @public
 */
export interface IBlobConditionalDeleteRequest {
    readonly key: string;
    /** Expected actual resource identity; when supplied, the provider must reject a mismatch before deletion. */
    readonly resourceId?: string;
    readonly bucket?: string;
    readonly versionId?: string;
    readonly snapshotId?: string;
    readonly ifMatch: string;
    /** Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries. */
    readonly timeoutMs?: number;
    readonly abortSignal?: AbortSignal;
}
