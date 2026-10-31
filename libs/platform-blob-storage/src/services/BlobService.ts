// #region Imports

import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { BlobObjectPersistenceBase } from '../abstracts/BlobObjectPersistenceBase.js';
import { BlobVariantPersistenceBase } from '../abstracts/BlobVariantPersistenceBase.js';
import { BlobObjectNotFoundError } from '../errors/BlobObjectNotFoundError.js';
import { BlobStorageUnsupportedOperationError } from '../errors/BlobStorageUnsupportedOperationError.js';
import { normalizeBlobStorageError } from '../errors/normalizeBlobStorageError.js';
import { BlobOptionalOperation } from '../interfaces/IBlobProvider.js';
import type {
    BlobDownloadResponseType,
    IBlobDeleteRequest,
    IBlobDownloadRequest,
    IBlobDownloadResult,
    IBlobExistsRequest,
    IBlobListRequest,
    IBlobListResult,
    IBlobSignedUrlRequest,
    IBlobUploadRequest,
    IBlobUploadResult,
} from '../interfaces/IBlobProvider.js';
import type { BlobStorageStrategyBase } from '../strategies/abstracts/BlobStorageStrategyBase.js';
import { BLOB_STORAGE_STRATEGY_TOKEN } from '../tokens/BlobStorageTokens.js';

// #endregion

/**
 * Provides a generic abstraction for blob storage operations independent of the underlying provider.
 *
 * @public
 */
@Injectable()
export class BlobService {
    // #region Fields

    private readonly _logger = new Logger(BlobService.name);
    private readonly _storageStrategy: BlobStorageStrategyBase;
    private readonly _objectPersistence: BlobObjectPersistenceBase | null;
    private readonly _variantPersistence: BlobVariantPersistenceBase | null;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link BlobService} class.
     *
     * @public
     * @param storageStrategy - The concrete blob storage strategy implementation.
     * @param objectPersistence - Optional abstract base persisting original blob metadata.
     * @param variantPersistence - Optional abstract base persisting derived blob metadata.
     */
    public constructor(
        @Inject(BLOB_STORAGE_STRATEGY_TOKEN) storageStrategy: BlobStorageStrategyBase,
        @Optional() @Inject(BlobObjectPersistenceBase) objectPersistence: BlobObjectPersistenceBase | null,
        @Optional() @Inject(BlobVariantPersistenceBase) variantPersistence: BlobVariantPersistenceBase | null,
    ) {
        this._storageStrategy = storageStrategy;
        this._objectPersistence = objectPersistence ?? null;
        this._variantPersistence = variantPersistence ?? null;
    }

    // #endregion

    // #region Methods

    /**
     * Uploads an object to the configured blob provider.
     *
     * @public
     * @param request - The upload request describing the object.
     * @returns The provider specific upload result.
     */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        let result: IBlobUploadResult;

        try {
            result = await this._storageStrategy.uploadObject(request);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'upload', request.key);
        }

        if (!this._objectPersistence) {
            return result;
        }

        return { ...result, metadataPersisted: await this.persistObjectMetadata(result) };
    }

    /**
     * Uploads a derived variant for an existing blob object.
     *
     * @public
     * @param originalId - The identifier of the original blob object.
     * @param label - The variant label identifying the derivative.
     * @param request - The upload request describing the variant blob.
     * @returns The provider specific upload result.
     */
    public async uploadVariant(originalId: string, label: string, request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        let result: IBlobUploadResult;

        try {
            result = await this._storageStrategy.uploadObject(request);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'upload', request.key);
        }

        if (!this._variantPersistence) {
            return result;
        }

        return { ...result, metadataPersisted: await this.persistVariantMetadata(originalId, label, result) };
    }

    /**
     * Downloads an object from the configured blob provider.
     *
     * @public
     * @param request - The download request describing the object.
     * @returns The downloaded data and related metadata.
     */
    public async downloadObject<TData>(request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>> {
        try {
            return await this._storageStrategy.downloadObject<TData>(request);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'download', request.key);
        }
    }

    /**
     * Deletes an object from the configured blob provider.
     *
     * @public
     * @param request - The delete request describing the object.
     */
    public async deleteObject(request: IBlobDeleteRequest): Promise<void> {
        try {
            await this._storageStrategy.deleteObject(request);
        } catch (error: unknown) {
            const normalized = normalizeBlobStorageError(error, this._storageStrategy.providerId, 'delete', request.key);

            if (!(normalized instanceof BlobObjectNotFoundError)) {
                throw normalized;
            }
        }

        try {
            await this._objectPersistence?.markAsDeleted(this._storageStrategy.providerId, this.resolveBucket(request.bucket), request.key, request.versionId);
        } catch (error: unknown) {
            this._logger.error(
                `Blob object ${request.key} was deleted but its persistence record could not be updated. ` +
                    'The record still marks an object that no longer exists.',
                error,
            );
        }
    }

    /**
     * Determines whether an object exists without downloading its contents.
     *
     * @public
     * @param request - The request describing the object to inspect.
     * @returns `true` when the object exists; otherwise `false`.
     */
    public async objectExists(request: IBlobExistsRequest): Promise<boolean> {
        try {
            return await this._storageStrategy.objectExists(request);
        } catch (error: unknown) {
            const normalized = normalizeBlobStorageError(error, this._storageStrategy.providerId, 'exists', request.key);

            if (normalized instanceof BlobObjectNotFoundError) {
                return false;
            }

            throw normalized;
        }
    }

    /**
     * Generates a signed URL for the specified object.
     *
     * @public
     * @param request - The request describing the object.
     * @returns A signed URL that can be used to access the object.
     */
    public async createSignedUrl(request: IBlobSignedUrlRequest): Promise<string> {
        if (!this._storageStrategy.createSignedUrl) {
            throw new BlobStorageUnsupportedOperationError(this._storageStrategy.providerId, 'createSignedUrl', request.key);
        }

        if (!(await this.objectExists(request))) {
            throw new BlobObjectNotFoundError(this._storageStrategy.providerId, 'createSignedUrl', request.key);
        }

        try {
            return await this._storageStrategy.createSignedUrl(request);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'createSignedUrl', request.key);
        }
    }

    /**
     * Lists objects of the configured bucket page by page.
     *
     * Not every provider can enumerate its contents; callers that depend on enumeration should treat
     * {@link BlobStorageUnsupportedOperationError} as a missing capability rather than a failure.
     *
     * @public
     * @param request - The listing request describing prefix, page size and continuation.
     * @returns One page of entries and the token for the next page.
     */
    public async listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
        if (!this._storageStrategy.listObjects) {
            throw new BlobStorageUnsupportedOperationError(this._storageStrategy.providerId, 'listObjects', request.prefix ?? '');
        }

        try {
            return await this._storageStrategy.listObjects(request);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'listObjects', request.prefix ?? '');
        }
    }

    /**
     * Determines whether the configured provider supports an optional operation.
     *
     * Lets a caller adapt before attempting the operation instead of treating
     * {@link BlobStorageUnsupportedOperationError} as control flow.
     *
     * @public
     * @param operation - The operation to probe.
     */
    public supports(operation: BlobOptionalOperation): boolean {
        return typeof this._storageStrategy[operation] === 'function';
    }

    /**
     * Uploads a buffer using the provided key.
     *
     * @public
     * @param key - The object key.
     * @param buffer - The data to upload.
     * @param contentType - The content type of the upload.
     * @returns The provider specific upload result.
     */
    public uploadFile(key: string, buffer: Buffer, contentType?: string, metadata?: Record<string, string>): Promise<IBlobUploadResult> {
        const request: IBlobUploadRequest = {
            key,
            body: buffer,
            contentType,
            metadata,
        };

        return this.uploadObject(request);
    }

    /**
     * Downloads a file by key.
     *
     * @public
     * @param key - The object key.
     * @param responseType - The expected response type.
     * @returns The downloaded data and related metadata.
     */
    public downloadFile<TData>(key: string, responseType?: BlobDownloadResponseType): Promise<IBlobDownloadResult<TData>> {
        const request: IBlobDownloadRequest = {
            key,
            responseType,
        };

        return this.downloadObject<TData>(request);
    }

    /**
     * Deletes a file by key.
     *
     * @public
     * @param key - The object key.
     */
    public deleteFile(key: string): Promise<void> {
        const request: IBlobDeleteRequest = {
            key,
        };

        return this.deleteObject(request);
    }

    /**
     * Determines whether a file exists by key.
     *
     * @public
     * @param key - The object key.
     * @returns `true` when the file exists; otherwise `false`.
     */
    public fileExists(key: string): Promise<boolean> {
        return this.objectExists({ key });
    }

    private async persistObjectMetadata(result: IBlobUploadResult): Promise<boolean> {
        try {
            await this._objectPersistence?.createFromMetadata(result.metadata);

            return true;
        } catch (error: unknown) {
            this._logger.error(
                `Blob object ${result.metadata.key} was stored but its metadata could not be persisted. ` + 'The object exists without a persistence record.',
                error,
            );

            return false;
        }
    }

    private async persistVariantMetadata(originalId: string, label: string, result: IBlobUploadResult): Promise<boolean> {
        try {
            await this._variantPersistence?.createFromMetadata(originalId, label, result.metadata);

            return true;
        } catch (error: unknown) {
            this._logger.error(
                `Blob variant ${label} of ${originalId} was stored but its metadata could not be persisted. ` +
                    'The variant exists without a persistence record.',
                error,
            );

            return false;
        }
    }

    private resolveBucket(requestedBucket?: string): string {
        return requestedBucket ?? this._storageStrategy.defaultBucket ?? '';
    }

    // #endregion
}
