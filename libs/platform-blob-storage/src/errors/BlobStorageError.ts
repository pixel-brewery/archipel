/**
 * Describes a provider-independent blob storage operation failure.
 *
 * @public
 */
export class BlobStorageError extends Error {
    // #region Fields

    public readonly code: string;
    public readonly key: string;
    public readonly operation: string;
    public readonly providerId: string;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link BlobStorageError} class.
     *
     * @public
     * @param code - Stable machine-readable error code.
     * @param message - Safe human-readable error message.
     * @param providerId - Identifier of the active storage provider.
     * @param operation - Storage operation that failed.
     * @param key - Object key involved in the failure.
     * @param cause - Original provider error.
     */
    public constructor(code: string, message: string, providerId: string, operation: string, key: string, cause?: unknown) {
        super(message, { cause });

        this.name = BlobStorageError.name;
        this.code = code;
        this.providerId = providerId;
        this.operation = operation;
        this.key = key;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
