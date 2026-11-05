import type { IBlobObjectHistoryEntry } from './IBlobObjectHistoryEntry.js';

/**
 * One exact-key history page within the active provider's configured resource.
 *
 * This does not inspect deleted containers, backups, replicas or external restore paths.
 * Even an empty page must be followed while a continuation token remains.
 *
 * @public
 */
export interface IBlobObjectHistoryResult {
    readonly providerId: string;
    /** Actual resource endpoint without user information, credentials, query or fragment. */
    readonly resourceId: string;
    readonly bucket: string;
    readonly entries: ReadonlyArray<IBlobObjectHistoryEntry>;
    readonly continuationToken?: string;
}
