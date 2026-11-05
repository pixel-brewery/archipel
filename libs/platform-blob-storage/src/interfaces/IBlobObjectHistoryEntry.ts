/**
 * One current, versioned, snapshot or soft-deleted object observed by the provider.
 *
 * Missing optional facts are unknown, not proof of irreversible deletion.
 *
 * @public
 */
export interface IBlobObjectHistoryEntry {
    readonly key: string;
    readonly versionId?: string;
    readonly snapshotId?: string;
    readonly isCurrentVersion?: boolean;
    readonly deleted: boolean;
    readonly etag?: string;
    readonly deletedAt?: Date;
    readonly remainingRetentionDays?: number;
}
