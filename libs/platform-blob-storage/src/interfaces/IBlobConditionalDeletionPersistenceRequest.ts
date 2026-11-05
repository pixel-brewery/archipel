/**
 * Identifies the exact generation whose conditional provider deletion succeeded.
 *
 * Persistence adapters must compare all scope and generation fields atomically.
 * A different or missing generation must remain unchanged.
 *
 * @public
 */
export interface IBlobConditionalDeletionPersistenceRequest {
    readonly providerId: string;
    readonly resourceId: string;
    readonly bucket: string;
    readonly key: string;
    readonly ifMatch: string;
    readonly versionId?: string;
    readonly snapshotId?: string;
}
