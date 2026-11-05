import { BlobStorageError } from './BlobStorageError.js';

/**
 * The selected object no longer meets the caller's conditional deletion guard.
 *
 * @public
 */
export class BlobStoragePreconditionFailedError extends BlobStorageError {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a provider-neutral precondition failure.
     *
     * @param providerId - Active storage provider.
     * @param operation - Guarded operation.
     * @param key - Selected object key.
     * @param cause - Original provider failure, retained without exposing its contents.
     * @public
     */
    public constructor(providerId: string, operation: string, key: string, cause?: unknown) {
        super('BLOB_STORAGE_PRECONDITION_FAILED', 'The blob object no longer meets the requested precondition.', providerId, operation, key, cause);
        this.name = BlobStoragePreconditionFailedError.name;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
