import type {
    IBlobDeleteRequest,
    IBlobDownloadRequest,
    IBlobDownloadResult,
    IBlobExistsRequest,
    IBlobListRequest,
    IBlobListResult,
    IBlobSignedUrlRequest,
    IBlobUploadRequest,
    IBlobUploadResult,
} from '../../interfaces/IBlobProvider.js';

/**
 * Abstract base class for blob storage strategies.
 * Every concrete provider (AWS S3, Azure, Vercel, Local, etc.) must extend this class.
 * Serves as both the type contract and the NestJS DI token type reference.
 *
 * @public
 */
export abstract class BlobStorageStrategyBase {
    // #region Fields

    /**
     * Gets the unique identifier for this storage provider.
     */
    public abstract readonly providerId: string;

    /**
     * Gets the default bucket (container/directory) configured for the provider.
     */
    public abstract readonly defaultBucket?: string;

    // #endregion

    // #region Ctor

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected constructor() {}

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Uploads a blob object to the storage backend.
     *
     * @public
     * @param request - The upload request describing the object to upload.
     * @returns The resulting upload metadata.
     */
    public abstract uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult>;

    /**
     * Downloads a blob object from the storage backend.
     *
     * @public
     * @param request - The download request describing the object to download.
     * @returns The download result including payload and metadata.
     */
    public abstract downloadObject<TData>(request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>>;

    /**
     * Deletes a blob object from the storage backend.
     *
     * @public
     * @param request - The delete request describing the object to remove.
     */
    public abstract deleteObject(request: IBlobDeleteRequest): Promise<void>;

    /**
     * Determines whether a blob object exists in the storage backend.
     *
     * @public
     * @param request - The request describing the object to inspect.
     */
    public abstract objectExists(request: IBlobExistsRequest): Promise<boolean>;

    /**
     * Creates a signed URL for the specified blob object.
     * Not all providers support this operation.
     *
     * @public
     * @param request - The request describing the object to link.
     * @returns The generated signed URL.
     */
    public createSignedUrl?(request: IBlobSignedUrlRequest): Promise<string>;

    /**
     * Lists objects of a bucket page by page.
     *
     * Optional because not every backing store can enumerate its contents. Consumers that reconcile
     * their own bookkeeping against actual storage depend on it, so a strategy that can enumerate
     * should implement it rather than leaving the capability unavailable.
     *
     * @public
     * @param request - The listing request describing prefix, page size and continuation.
     * @returns One page of entries and the token for the next page.
     */
    public listObjects?(request: IBlobListRequest): Promise<IBlobListResult>;

    // #endregion
}
