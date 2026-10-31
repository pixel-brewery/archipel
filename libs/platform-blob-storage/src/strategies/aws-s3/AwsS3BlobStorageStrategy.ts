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
import { BlobStorageStrategyBase } from '../abstracts/BlobStorageStrategyBase.js';
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

    /** @inheritdoc */
    public get defaultBucket(): string {
        return this._bucket;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
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

        this._logger.debug(`Uploaded blob '${key}' to bucket '${bucket}'.`);

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

        this._logger.debug(`Deleted blob '${key}' from bucket '${bucket}'.`);
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

    // #endregion

    // #region Helpers

    /** @inheritdoc */
    public override async listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
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
