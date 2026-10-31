import type { IBlobObjectMetadata } from '../interfaces/IBlobProvider.js';

/**
 * Abstract base for persisting blob object metadata.
 * Consuming projects must provide a concrete implementation (e.g. backed by Prisma, Mongo, etc.)
 * and register it via `BlobModule.forRoot({ objectPersistence: MyAdapter })`.
 *
 * @public
 */
export abstract class BlobObjectPersistenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Persists metadata for a newly uploaded blob object.
     *
     * @public
     * @param metadata - The object metadata returned by the blob provider after upload.
     */
    public abstract createFromMetadata(metadata: IBlobObjectMetadata): Promise<void>;

    /**
     * Marks an existing blob object as deleted.
     *
     * @public
     * @param provider - The storage provider identifier.
     * @param bucket - The bucket name.
     * @param key - The object key.
     * @param versionId - Optional version identifier.
     */
    public abstract markAsDeleted(provider: string, bucket: string, key: string, versionId?: string): Promise<void>;

    // #endregion
}
