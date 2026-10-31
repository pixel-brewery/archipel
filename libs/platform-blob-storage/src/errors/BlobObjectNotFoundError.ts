// #region Imports

import { BlobStorageError } from './BlobStorageError.js';

// #endregion

/**
 * Indicates that the requested blob object does not exist.
 *
 * @public
 */
export class BlobObjectNotFoundError extends BlobStorageError {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link BlobObjectNotFoundError} class.
     *
     * @public
     * @param providerId - Identifier of the active storage provider.
     * @param operation - Storage operation that discovered the missing object.
     * @param key - Missing object key.
     * @param cause - Original provider error.
     */
    public constructor(providerId: string, operation: string, key: string, cause?: unknown) {
        super('BLOB_OBJECT_NOT_FOUND', `Blob object '${key}' was not found.`, providerId, operation, key, cause);

        this.name = BlobObjectNotFoundError.name;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
