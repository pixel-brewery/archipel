// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import type { Readable } from 'node:stream';
import type {
    IBlobDeleteRequest,
    IBlobDownloadRequest,
    IBlobDownloadResult,
    IBlobExistsRequest,
    IBlobListRequest,
    IBlobListResult,
    IBlobObjectMetadata,
    IBlobSignedUrlRequest,
    IBlobUploadRequest,
    IBlobUploadResult,
} from '../../interfaces/IBlobProvider.js';
import type {
    IBlobMultipartAbortRequest,
    IBlobMultipartCompleteRequest,
    IBlobMultipartPart,
    IBlobMultipartPartRequest,
    IBlobMultipartUpload,
    IBlobMultipartUploadLimits,
    IBlobMultipartUploadStartRequest,
} from '../../interfaces/IBlobMultipartUpload.js';
import { BlobStorageStrategyBase } from '../abstracts/BlobStorageStrategyBase.js';
import { assertBlobExecutionSupport } from '../assertBlobExecutionSupport.js';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_BUCKET, AWS_S3_ENDPOINT, AWS_S3_REGION, AWS_S3_SECRET_ACCESS_KEY } from './env.js';

// #endregion

/**
 * Provides a blob storage strategy backed by Amazon S3.
 *
 * @public
 */
@Injectable()
export class AwsS3BlobStorageStrategy extends BlobStorageStrategyBase {
    // #region Fields

    private readonly _logger = new Logger(AwsS3BlobStorageStrategy.name);
    private readonly _region: string;
    private readonly _bucket: string;
    private readonly _accessKeyId: string;
    private readonly _secretAccessKey: string;
    private readonly _endpoint: string;
    private _clientPromise: Promise<unknown> | null = null;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link AwsS3BlobStorageStrategy} class.
     *
     * @public
     * @param configService - The configuration service providing environment values.
     */
    public constructor(configService: ConfigService) {
        super();

        const region = configService.get<string>(AWS_S3_REGION.key) ?? '';
        const bucket = configService.get<string>(AWS_S3_BUCKET.key) ?? '';

        if (!region) {
            throw new Error('Missing AWS S3 region configuration.');
        }

        if (!bucket) {
            throw new Error('Missing AWS S3 bucket configuration.');
        }

        this._region = region;
        this._bucket = bucket;
        this._accessKeyId = configService.tryGet<string>(AWS_S3_ACCESS_KEY_ID.key, '') ?? '';
        this._secretAccessKey = configService.tryGet<string>(AWS_S3_SECRET_ACCESS_KEY.key, '') ?? '';
        this._endpoint = configService.tryGet<string>(AWS_S3_ENDPOINT.key, '') ?? '';

        if ((this._accessKeyId && !this._secretAccessKey) || (!this._accessKeyId && this._secretAccessKey)) {
            throw new Error('Both accessKeyId and secretAccessKey must be provided together, or omit both to use the default AWS credential chain.');
        }
    }

    // #endregion

    // #region Properties

    /** @inheritdoc */
    public readonly providerId: string = 'aws-s3';

    /**
     * S3 multipart limits: parts of 5 MiB to 5 GiB except the last, at most 10,000 parts.
     *
     * @public
     */
    public override readonly multipartUploadLimits: IBlobMultipartUploadLimits = {
        minimumPartBytes: 5 * 1024 * 1024,
        maximumPartBytes: 5 * 1024 * 1024 * 1024,
        maximumParts: 10_000,
    };

    /** @inheritdoc */
    public get defaultBucket(): string {
        return this._bucket;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        assertBlobExecutionSupport(this, 'uploadObject', request.key, request.execution);

        const { PutObjectCommand } = await this.loadSdk();
        const client = await this.getClient();
        const key = this.normalizeKey(request.key);
        const bucket = request.bucket ?? this._bucket;
        const contentType = request.contentType ?? 'application/octet-stream';
        const contentLength = this.resolveContentLength(request);

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: request.body as Buffer | Readable,
            ContentType: contentType,
            ContentLength: contentLength > 0 ? contentLength : undefined,
            ChecksumSHA256: request.checksumSha256,
            Metadata: request.metadata,
        });

        const response = await client.send(command);

        this._logger.debug({ operation: 'blobObject.upload', providerId: this.providerId, result: 'succeeded' });

        const metadata: IBlobObjectMetadata = {
            provider: this.providerId,
            bucket,
            region: request.region ?? this._region,
            key,
            versionId: response.VersionId,
            size: contentLength,
            contentType,
            etag: response.ETag,
            checksumSha256: response.ChecksumSHA256 ?? request.checksumSha256,
            storageClass: undefined,
            metadata: request.metadata,
            isLatest: true,
            ownerUserId: request.ownerUserId,
        };

        return {
            metadata,
            rawResponse: response,
        };
    }

    /** @inheritdoc */
    public async downloadObject<TData>(request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>> {
        assertBlobExecutionSupport(this, 'downloadObject', request.key, request.execution, request.maxBytes);

        const { GetObjectCommand } = await this.loadSdk();
        const client = await this.getClient();
        const key = this.normalizeKey(request.key);
        const bucket = request.bucket ?? this._bucket;

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
            VersionId: request.versionId,
        });

        const response = await client.send(command);
        const data = await this.readResponseBody<TData>(response.Body, request.responseType);

        return {
            data,
            contentType: response.ContentType,
            contentLength: response.ContentLength,
            metadata: response.Metadata,
            rawResponse: response,
        };
    }

    /** @inheritdoc */
    public async deleteObject(request: IBlobDeleteRequest): Promise<void> {
        const { DeleteObjectCommand } = await this.loadSdk();
        const client = await this.getClient();
        const key = this.normalizeKey(request.key);
        const bucket = request.bucket ?? this._bucket;

        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
            VersionId: request.versionId,
        });

        await client.send(command);

        this._logger.debug({ operation: 'blobObject.delete', providerId: this.providerId, result: 'succeeded' });
    }

    /** @inheritdoc */
    public async objectExists(request: IBlobExistsRequest): Promise<boolean> {
        const { HeadObjectCommand } = await this.loadSdk();
        const client = await this.getClient();
        const key = this.normalizeKey(request.key);
        const bucket = request.bucket ?? this._bucket;
        const command = new HeadObjectCommand({
            Bucket: bucket,
            Key: key,
            VersionId: request.versionId,
        });

        await client.send(command);

        return true;
    }

    /** @inheritdoc */
    public override async createSignedUrl(request: IBlobSignedUrlRequest): Promise<string> {
        const { GetObjectCommand } = await this.loadSdk();
        const { getSignedUrl } = await this.loadPresigner();
        const client = await this.getClient();
        const key = this.normalizeKey(request.key);
        const bucket = request.bucket ?? this._bucket;
        const expiresIn = Math.min(Math.max(request.expiresInSeconds ?? 3600, 60), 604_800);

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
            VersionId: request.versionId,
        });

        return getSignedUrl(client, command, { expiresIn });
    }

    /** @inheritdoc */
    public override async createMultipartUpload(request: IBlobMultipartUploadStartRequest): Promise<IBlobMultipartUpload> {
        const { CreateMultipartUploadCommand } = await this.loadSdk();
        const client = await this.getClient();
        const key = this.normalizeKey(request.key);
        const contentType = request.contentType ?? 'application/octet-stream';
        const response = await client.send(
            new CreateMultipartUploadCommand({
                Bucket: request.bucket ?? this._bucket,
                Key: key,
                ContentType: contentType,
                ContentDisposition: request.contentDisposition,
                Metadata: request.metadata,
            }),
        );
        if (!response.UploadId) {
            throw new Error('S3 did not return a multipart upload identifier.');
        }

        return {
            provider: this.providerId,
            key,
            ...(request.bucket !== undefined ? { bucket: request.bucket } : {}),
            uploadId: response.UploadId,
            contentType,
            ...(request.contentDisposition !== undefined ? { contentDisposition: request.contentDisposition } : {}),
            ...(request.metadata !== undefined ? { metadata: { ...request.metadata } } : {}),
            ...(request.ownerUserId !== undefined ? { ownerUserId: request.ownerUserId } : {}),
        };
    }

    /** @inheritdoc */
    public override async uploadMultipartPart(request: IBlobMultipartPartRequest): Promise<IBlobMultipartPart> {
        const { UploadPartCommand } = await this.loadSdk();
        const client = await this.getClient();
        const { upload } = request;
        const response = await client.send(
            new UploadPartCommand({
                Bucket: upload.bucket ?? this._bucket,
                Key: upload.key,
                UploadId: upload.uploadId,
                PartNumber: request.partNumber,
                Body: request.body,
                ContentLength: request.body.length,
            }),
        );
        if (!response.ETag) {
            throw new Error('S3 did not return a part receipt.');
        }

        return { partNumber: request.partNumber, token: response.ETag, size: request.body.length };
    }

    /** @inheritdoc */
    public override async completeMultipartUpload(request: IBlobMultipartCompleteRequest): Promise<IBlobUploadResult> {
        const { CompleteMultipartUploadCommand } = await this.loadSdk();
        const client = await this.getClient();
        const { upload } = request;
        const parts = [...request.parts].sort((left, right) => left.partNumber - right.partNumber);
        const bucket = upload.bucket ?? this._bucket;
        const response = await client.send(
            new CompleteMultipartUploadCommand({
                Bucket: bucket,
                Key: upload.key,
                UploadId: upload.uploadId,
                MultipartUpload: { Parts: parts.map((part) => ({ PartNumber: part.partNumber, ETag: part.token })) },
            }),
        );
        this._logger.debug({ operation: 'blobObject.completeMultipartUpload', providerId: this.providerId, result: 'succeeded' });

        return {
            metadata: {
                provider: this.providerId,
                bucket,
                region: this._region,
                key: upload.key,
                versionId: response.VersionId,
                size: parts.reduce((total, part) => total + part.size, 0),
                contentType: upload.contentType,
                etag: response.ETag,
                ...(upload.metadata !== undefined ? { metadata: { ...upload.metadata } } : {}),
                isLatest: true,
                ownerUserId: upload.ownerUserId,
            },
            rawResponse: response,
        };
    }

    /** @inheritdoc */
    public override async abortMultipartUpload(request: IBlobMultipartAbortRequest): Promise<void> {
        const { AbortMultipartUploadCommand } = await this.loadSdk();
        const client = await this.getClient();
        const { upload } = request;
        try {
            await client.send(new AbortMultipartUploadCommand({ Bucket: upload.bucket ?? this._bucket, Key: upload.key, UploadId: upload.uploadId }));
        } catch (error: unknown) {
            if ((error as { name?: unknown } | null)?.name !== 'NoSuchUpload') {
                throw error;
            }
        }
    }

    // #endregion

    // #region Helpers

    /** @inheritdoc */
    public override async listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
        assertBlobExecutionSupport(this, 'listObjects', request.prefix ?? '', request.execution);

        const { ListObjectsV2Command } = await this.loadSdk();
        const client = await this.getClient();

        const command = new ListObjectsV2Command({
            Bucket: request.bucket ?? this._bucket,
            Prefix: request.prefix,
            ContinuationToken: request.continuationToken,
            MaxKeys: Math.min(Math.max(request.maxKeys ?? 1000, 1), 1000),
        });

        const response = await client.send(command);

        return {
            entries: (response.Contents ?? [])
                .filter((item): item is typeof item & { Key: string } => typeof item.Key === 'string')
                .map((item) => ({
                    key: item.Key,
                    size: item.Size ?? 0,
                    lastModified: item.LastModified,
                    etag: item.ETag,
                })),
            continuationToken: response.IsTruncated ? response.NextContinuationToken : undefined,
        };
    }

    private async loadSdk(): Promise<typeof import('@aws-sdk/client-s3')> {
        try {
            return await import('@aws-sdk/client-s3');
        } catch {
            throw new Error('The "@aws-sdk/client-s3" package is required for AwsS3BlobStorageStrategy. Install it with: npm install @aws-sdk/client-s3');
        }
    }

    private async loadPresigner(): Promise<typeof import('@aws-sdk/s3-request-presigner')> {
        try {
            return await import('@aws-sdk/s3-request-presigner');
        } catch {
            throw new Error(
                'The "@aws-sdk/s3-request-presigner" package is required for signed URL generation. Install it with: npm install @aws-sdk/s3-request-presigner',
            );
        }
    }

    private async getClient(): Promise<InstanceType<Awaited<ReturnType<typeof this.loadSdk>>['S3Client']>> {
        if (!this._clientPromise) {
            this._clientPromise = this.createClient();
        }
        return this._clientPromise as Promise<InstanceType<Awaited<ReturnType<typeof this.loadSdk>>['S3Client']>>;
    }

    private async createClient(): Promise<unknown> {
        const { S3Client } = await this.loadSdk();

        return new S3Client({
            region: this._region,
            ...(this._accessKeyId && this._secretAccessKey
                ? {
                      credentials: {
                          accessKeyId: this._accessKeyId,
                          secretAccessKey: this._secretAccessKey,
                      },
                  }
                : {}),
            endpoint: this._endpoint || undefined,
        });
    }

    private normalizeKey(key: string): string {
        const normalized = key.replace(/\\/g, '/').replace(/^\/+/, '');
        const segments = normalized.split('/').filter((s) => s !== '.' && s !== '..');

        // eslint-disable-next-line no-control-regex
        if (segments.some((s) => /[\x00-\x1f]/.test(s))) {
            throw new Error('Invalid blob key: control characters are not allowed');
        }

        return segments.join('/');
    }

    private resolveContentLength(request: IBlobUploadRequest): number {
        if (typeof request.contentLength === 'number') {
            return request.contentLength;
        }

        if (Buffer.isBuffer(request.body)) {
            return request.body.byteLength;
        }

        return 0;
    }

    private async readResponseBody<TData>(body: unknown, responseType?: string): Promise<TData> {
        if (!body) {
            return undefined as TData;
        }

        const sdkStream = body as {
            transformToByteArray(): Promise<Uint8Array>;
            transformToString(encoding?: string): Promise<string>;
        };

        switch (responseType) {
            case 'arraybuffer': {
                const bytes = await sdkStream.transformToByteArray();

                return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as TData;
            }
            case 'text':
                return (await sdkStream.transformToString('utf-8')) as TData;
            case 'json': {
                const text = await sdkStream.transformToString('utf-8');

                try {
                    return JSON.parse(text) as TData;
                } catch {
                    throw new Error('Failed to parse blob content as JSON');
                }
            }
            case 'stream':
            default: {
                const bytes = await sdkStream.transformToByteArray();

                return Buffer.from(bytes) as TData;
            }
        }
    }

    // #endregion
}
