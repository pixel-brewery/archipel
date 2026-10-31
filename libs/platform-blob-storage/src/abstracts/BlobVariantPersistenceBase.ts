import type { IBlobObjectMetadata } from '../interfaces/IBlobProvider.js';

/**
 * Abstract base for persisting blob variant metadata.
 * Consuming projects must provide a concrete implementation and register it
 * via `BlobModule.forRoot({ variantPersistence: MyAdapter })`.
 *
 * @public
 */
export abstract class BlobVariantPersistenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Persists metadata for a newly created blob variant.
     *
     * @public
     * @param originalId - The identifier of the original blob object.
     * @param label - A label describing the variant (e.g. 'thumbnail', 'preview').
     * @param metadata - The object metadata returned by the blob provider after upload.
     */
    public abstract createFromMetadata(originalId: string, label: string, metadata: IBlobObjectMetadata): Promise<void>;

    // #endregion
}
