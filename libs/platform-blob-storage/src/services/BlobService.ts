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
import type { IBlobConditionalDeleteRequest } from '../interfaces/IBlobConditionalDeleteRequest.js';
import type { IBlobObjectHistoryRequest } from '../interfaces/IBlobObjectHistoryRequest.js';
import type { IBlobObjectHistoryResult } from '../interfaces/IBlobObjectHistoryResult.js';
import type { BlobExecutionOperation } from '../interfaces/BlobExecutionOperation.js';
import type { BlobStorageStrategyBase } from '../strategies/abstracts/BlobStorageStrategyBase.js';
import { assertBlobExecutionSupport } from '../strategies/assertBlobExecutionSupport.js';
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
        assertBlobExecutionSupport(this._storageStrategy, 'uploadObject', request.key, request.execution);
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
        assertBlobExecutionSupport(this._storageStrategy, 'uploadObject', request.key, request.execution);
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
        assertBlobExecutionSupport(this._storageStrategy, 'downloadObject', request.key, request.execution, request.maxBytes);
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

        await this.markAsDeleted(request);
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
        assertBlobExecutionSupport(this._storageStrategy, 'listObjects', request.prefix ?? '', request.execution);
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
     * Reads one exact-key page of versions, snapshots and soft-deletion observations.
     *
     * Unsupported providers and failed reads throw; neither becomes an empty successful page.
     * Callers must follow continuation tokens and separately assess other recovery systems.
     *
     * @param request - Exact key, bounded page and cancellation budget.
     * @returns One provider history page within the configured resource.
     * @public
     */
    public async inspectObjectHistory(request: IBlobObjectHistoryRequest): Promise<IBlobObjectHistoryResult> {
        if (!this._storageStrategy.inspectObjectHistory) {
            throw new BlobStorageUnsupportedOperationError(this._storageStrategy.providerId, 'inspectObjectHistory', request.key);
        }

        try {
            return await this._storageStrategy.inspectObjectHistory(request);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'inspectObjectHistory', request.key);
        }
    }

    /**
     * Deletes only the selected object that still has its exact observed strong ETag.
     *
     * Failed preconditions and unavailable objects throw without updating persistence.
     * Deleting historical versions or snapshots does not release the base object's metadata.
     * Base metadata uses only the optional generation-CAS hook and a verified resource identity.
     * A successful provider deletion does not by itself prove that metadata was changed.
     * Cancellation bounds client I/O, not a provider mutation already accepted remotely.
     *
     * @param request - Exact ETag, optional immutable selector and cancellation budget.
     * @public
     */
    public async deleteObjectConditionally(request: IBlobConditionalDeleteRequest): Promise<void> {
        if (!this._storageStrategy.deleteObjectConditionally) {
            throw new BlobStorageUnsupportedOperationError(this._storageStrategy.providerId, 'deleteObjectConditionally', request.key);
        }

        const deletion = { ...request };
        try {
            await this._storageStrategy.deleteObjectConditionally(deletion);
        } catch (error: unknown) {
            throw normalizeBlobStorageError(error, this._storageStrategy.providerId, 'deleteObjectConditionally', deletion.key);
        }

        if (deletion.versionId === undefined && deletion.snapshotId === undefined) {
            await this.markAsDeletedIfUnchanged(deletion);
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
     * Probes guaranteed execution options on an existing operation.
     *
     * @param operation - Upload, download or listing operation.
     * @returns Whether the strategy enforces requested execution and byte limits.
     * @public
     */
    public supportsExecutionOptions(operation: BlobExecutionOperation): boolean {
        return this._storageStrategy.supportsExecutionOptions?.(operation) === true;
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

    private async markAsDeletedIfUnchanged(request: IBlobConditionalDeleteRequest): Promise<void> {
        const hook = this._objectPersistence?.markAsDeletedIfUnchanged;
        const bucket = this.resolveBucket(request.bucket);
        const diagnostic = {
            operation: 'blobObject.conditionalDeletePersistence',
            providerId: this._storageStrategy.providerId,
            providerDeletion: 'succeeded',
        };

        if (!hook || typeof request.resourceId !== 'string' || !request.resourceId || !bucket) {
            this._logger.warn({ ...diagnostic, metadataUpdate: 'skipped-unverified' });
            return;
        }

        try {
            const changed = await hook.call(this._objectPersistence, {
                providerId: this._storageStrategy.providerId,
                resourceId: request.resourceId,
                bucket,
                key: request.key,
                ifMatch: request.ifMatch,
                versionId: request.versionId,
                snapshotId: request.snapshotId,
            });
            if (!changed) {
                this._logger.warn({ ...diagnostic, metadataUpdate: 'not-matched' });
            }
        } catch {
            // Adapter errors may contain credentials or provider payloads; report only the safe outcome.
            this._logger.error({ ...diagnostic, metadataUpdate: 'failed' });
        }
    }

    private async markAsDeleted(request: IBlobDeleteRequest): Promise<void> {
        try {
            await this._objectPersistence?.markAsDeleted(this._storageStrategy.providerId, this.resolveBucket(request.bucket), request.key, request.versionId);
        } catch {
            this._logger.error({ operation: 'blobObject.deletePersistence', providerId: this._storageStrategy.providerId, result: 'failed' });
        }
    }

    private async persistObjectMetadata(result: IBlobUploadResult): Promise<boolean> {
        try {
            await this._objectPersistence?.createFromMetadata(result.metadata);

            return true;
        } catch {
            this._logger.error({ operation: 'blobObject.uploadPersistence', providerId: this._storageStrategy.providerId, result: 'failed' });

            return false;
        }
    }

    private async persistVariantMetadata(originalId: string, label: string, result: IBlobUploadResult): Promise<boolean> {
        try {
            await this._variantPersistence?.createFromMetadata(originalId, label, result.metadata);

            return true;
        } catch {
            this._logger.error({ operation: 'blobVariant.uploadPersistence', providerId: this._storageStrategy.providerId, result: 'failed' });

            return false;
        }
    }

    private resolveBucket(requestedBucket?: string): string {
        return requestedBucket ?? this._storageStrategy.defaultBucket ?? '';
    }

    // #endregion
}
