// #region Imports

import { BlobStorageError } from './BlobStorageError.js';

// #endregion

/**
 * Indicates that a blob operation was attempted while storage is disabled.
 *
 * @public
 */
export class BlobStorageDisabledError extends BlobStorageError {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link BlobStorageDisabledError} class.
     *
     * @public
     * @param operation - Storage operation that was attempted.
     * @param key - Object key involved in the operation.
     */
    public constructor(operation: string, key: string) {
        super('BLOB_STORAGE_DISABLED', 'Blob storage is disabled.', 'empty', operation, key);

        this.name = BlobStorageDisabledError.name;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
