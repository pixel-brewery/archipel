// #region Imports

import { BlobStorageError } from './BlobStorageError.js';

// #endregion

/**
 * Indicates a transient provider or network availability failure.
 *
 * @public
 */
export class BlobStorageUnavailableError extends BlobStorageError {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link BlobStorageUnavailableError} class.
     *
     * @public
     * @param providerId - Identifier of the active storage provider.
     * @param operation - Storage operation that failed.
     * @param key - Object key involved in the failure.
     * @param cause - Original provider error.
     */
    public constructor(providerId: string, operation: string, key: string, cause?: unknown) {
        super('BLOB_STORAGE_UNAVAILABLE', 'The blob storage provider is temporarily unavailable.', providerId, operation, key, cause);

        this.name = BlobStorageUnavailableError.name;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
