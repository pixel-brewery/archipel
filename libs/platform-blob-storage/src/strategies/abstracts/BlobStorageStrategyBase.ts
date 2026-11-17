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
import type { IBlobConditionalDeleteRequest } from '../../interfaces/IBlobConditionalDeleteRequest.js';
import type { IBlobObjectHistoryRequest } from '../../interfaces/IBlobObjectHistoryRequest.js';
import type { IBlobObjectHistoryResult } from '../../interfaces/IBlobObjectHistoryResult.js';
import type { BlobExecutionOperation } from '../../interfaces/BlobExecutionOperation.js';
import type {
    IBlobMultipartAbortRequest,
    IBlobMultipartCompleteRequest,
    IBlobMultipartPart,
    IBlobMultipartPartRequest,
    IBlobMultipartUpload,
    IBlobMultipartUploadLimits,
    IBlobMultipartUploadStartRequest,
} from '../../interfaces/IBlobMultipartUpload.js';

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

    /**
     * Gets the part limits of multipart uploads; present exactly when the strategy implements them.
     *
     * @public
     */
    public readonly multipartUploadLimits?: IBlobMultipartUploadLimits;

    // #endregion

    // #region Ctor

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected constructor() {}

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Reports whether an existing operation honors explicit execution limits.
     *
     * Missing support must reject requested limits before provider I/O. Ordinary
     * calls without limits retain their existing behavior.
     *
     * @param operation - Existing upload, download or listing operation.
     * @returns Whether deadlines, cancellation and applicable byte limits are enforced.
     * @public
     */
    public supportsExecutionOptions?(operation: BlobExecutionOperation): boolean;

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

    /**
     * Observes one exact-key history page, including available versions, snapshots and soft deletion.
     *
     * Does not inspect container restoration, backups or other recovery systems.
     *
     * @param request - Exact key, bounded page and cancellation budget.
     * @returns Provider observations, never an implicit irreversible-deletion guarantee.
     * @public
     */
    public inspectObjectHistory?(request: IBlobObjectHistoryRequest): Promise<IBlobObjectHistoryResult>;

    /**
     * Deletes the selected object only while its exact observed ETag still matches.
     *
     * A supplied resource identity must match the actual target before deletion.
     * Client cancellation does not undo a mutation already accepted by the provider.
     *
     * @param request - Exact ETag, optional immutable selector and cancellation budget.
     * @public
     */
    public deleteObjectConditionally?(request: IBlobConditionalDeleteRequest): Promise<void>;

    /**
     * Starts an upload whose content is transferred in separately uploaded parts.
     *
     * A strategy that implements this operation implements all multipart operations and
     * {@link BlobStorageStrategyBase.multipartUploadLimits}. The returned handle can be persisted and
     * continued in another process. Nothing is visible under the key before completion.
     *
     * @param request - Target key and the headers of the completed object.
     * @returns Serializable handle of the started upload.
     * @public
     */
    public createMultipartUpload?(request: IBlobMultipartUploadStartRequest): Promise<IBlobMultipartUpload>;

    /**
     * Uploads one part of a started multipart upload.
     *
     * @param request - Handle, part number and content of the part.
     * @returns Receipt that completes the upload together with the other parts.
     * @public
     */
    public uploadMultipartPart?(request: IBlobMultipartPartRequest): Promise<IBlobMultipartPart>;

    /**
     * Joins the uploaded parts in ascending part order and publishes the object under its key.
     *
     * @param request - Handle and the receipts of every part.
     * @returns Metadata of the completed object.
     * @public
     */
    public completeMultipartUpload?(request: IBlobMultipartCompleteRequest): Promise<IBlobUploadResult>;

    /**
     * Abandons a multipart upload and releases the parts the provider still holds.
     *
     * Aborting an unknown, completed or already aborted upload succeeds without effect and never
     * removes a completed object.
     *
     * @param request - Handle of the upload to abandon.
     * @public
     */
    public abortMultipartUpload?(request: IBlobMultipartAbortRequest): Promise<void>;

    // #endregion
}
