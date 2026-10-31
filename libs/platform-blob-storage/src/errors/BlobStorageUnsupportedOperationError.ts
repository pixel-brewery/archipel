// #region Imports

import { BlobStorageError } from './BlobStorageError.js';

// #endregion

/**
 * Indicates that the selected provider does not implement an operation.
 *
 * @public
 */
export class BlobStorageUnsupportedOperationError extends BlobStorageError {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link BlobStorageUnsupportedOperationError} class.
     *
     * @public
     * @param providerId - Identifier of the active storage provider.
     * @param operation - Unsupported storage operation.
     * @param key - Object key involved in the operation.
     */
    public constructor(providerId: string, operation: string, key: string) {
        super('BLOB_STORAGE_OPERATION_UNSUPPORTED', `Blob provider '${providerId}' does not support '${operation}'.`, providerId, operation, key);

        this.name = BlobStorageUnsupportedOperationError.name;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
