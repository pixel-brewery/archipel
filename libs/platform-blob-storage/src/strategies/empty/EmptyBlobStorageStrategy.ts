//#region Imports

import { Injectable, Logger } from '@nestjs/common';
import { BlobStorageDisabledError } from '../../errors/BlobStorageDisabledError.js';
import {
    IBlobDeleteRequest,
    IBlobDownloadRequest,
    IBlobDownloadResult,
    IBlobExistsRequest,
    IBlobListRequest,
    IBlobListResult,
    IBlobUploadRequest,
    IBlobUploadResult,
} from '../../interfaces/IBlobProvider.js';
import { BlobStorageStrategyBase } from '../abstracts/BlobStorageStrategyBase.js';

//#endregion

/**
 * Provides a blob storage strategy backed by the local filesystem.
 *
 * @public
 */
@Injectable()
export class EmptyBlobStorageStrategy extends BlobStorageStrategyBase {
    // #region Fields

    private readonly _logger = new Logger(EmptyBlobStorageStrategy.name);

    // #endregion

    //#region Ctor

    /**
     * Constructs a new instance of the `{@link EmptyBlobStorageStrategy}` class.
     *
     * @public
     */
    public constructor() {
        super();
    }

    //#endregion

    //#region Properties

    public readonly providerId: string = 'empty';

    public override defaultBucket?: string | undefined = undefined;

    //#endregion

    //#region Methods

    public override uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        this._logger.log(
            `[upload] ${JSON.stringify({
                key: request.key,
                contentType: request.contentType,
                contentLength: request.contentLength,
                metadata: request.metadata,
                checksumSha256: request.checksumSha256,
                ownerUserId: request.ownerUserId,
                bucket: request.bucket,
                region: request.region,
            })}`,
        );

        return Promise.reject(new BlobStorageDisabledError('upload', request.key));
    }

    public override downloadObject<TData>(request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>> {
        this._logger.log(
            `[download] ${JSON.stringify({
                key: request.key,
                versionId: request.versionId,
                responseType: request.responseType,
                bucket: request.bucket,
            })}`,
        );

        return Promise.reject(new BlobStorageDisabledError('download', request.key));
    }

    public override deleteObject(request: IBlobDeleteRequest): Promise<void> {
        this._logger.log(
            `[delete] ${JSON.stringify({
                key: request.key,
                versionId: request.versionId,
                bucket: request.bucket,
            })}`,
        );

        return Promise.reject(new BlobStorageDisabledError('delete', request.key));
    }

    /** @inheritdoc */
    public override objectExists(request: IBlobExistsRequest): Promise<boolean> {
        this._logger.log(
            `[exists] ${JSON.stringify({
                key: request.key,
                versionId: request.versionId,
                bucket: request.bucket,
            })}`,
        );

        return Promise.reject(new BlobStorageDisabledError('exists', request.key));
    }

    /** @inheritdoc */
    public override listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
        this._logger.log(`[list] ${JSON.stringify({ prefix: request.prefix, bucket: request.bucket })}`);

        return Promise.reject(new BlobStorageDisabledError('list', request.prefix ?? ''));
    }

    //#endregion
}
