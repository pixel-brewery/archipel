// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import type {
    IBlobDeleteRequest,
    IBlobDownloadRequest,
    IBlobDownloadResult,
    IBlobExistsRequest,
    IBlobObjectMetadata,
    IBlobListRequest,
    IBlobListResult,
    IBlobSignedUrlRequest,
    IBlobUploadRequest,
    IBlobUploadResult,
} from '../../interfaces/IBlobProvider.js';
import { BlobStorageStrategyBase } from '../abstracts/BlobStorageStrategyBase.js';
import { AZURE_BLOB_CONNECTION_STRING, AZURE_BLOB_CONTAINER_NAME } from './env.js';

// #endregion

/**
 * Provides a blob storage strategy backed by Microsoft Azure Blob Storage.
 *
 * @public
 */
@Injectable()
export class AzureBlobStorageStrategy extends BlobStorageStrategyBase {
    // #region Fields

    private readonly _logger = new Logger(AzureBlobStorageStrategy.name);
    private readonly _connectionString: string;
    private readonly _containerName: string;
    private _containerClient: unknown;
    private _containerClientPromise: Promise<unknown> | null = null;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link AzureBlobStorageStrategy} class.
     *
     * @public
     * @param configService - The configuration service providing environment values.
     */
    public constructor(configService: ConfigService) {
        super();

        const connectionString = configService.get<string>(AZURE_BLOB_CONNECTION_STRING.key) ?? '';
        const containerName = configService.get<string>(AZURE_BLOB_CONTAINER_NAME.key) ?? '';

        if (!connectionString) {
            throw new Error('Azure Blob Storage requires a connection string.');
        }

        if (!containerName) {
            throw new Error('Missing Azure Blob Storage container name configuration.');
        }

        this._connectionString = connectionString;
        this._containerName = containerName;
    }

    // #endregion

    // #region Properties

    /** @inheritdoc */
    public readonly providerId: string = 'azure';

    /** @inheritdoc */
    public get defaultBucket(): string {
        return this._containerName;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        const { BlockBlobClient: _BlockBlobClient } = await this.loadSdk();
        const containerClient = await this.getContainerClient();
        const key = this.normalizeKey(request.key);
        const blockBlobClient = containerClient.getBlockBlobClient(key) as InstanceType<typeof _BlockBlobClient>;

        const contentType = request.contentType ?? 'application/octet-stream';
        const contentLength = this.resolveContentLength(request);

        const options = {
            blobHTTPHeaders: {
                blobContentType: contentType,
            },
            metadata: request.metadata,
        };

        const response = await blockBlobClient.upload(request.body, contentLength, options);

        this._logger.debug(`Uploaded blob '${key}' to container '${this._containerName}'.`);

        const metadata: IBlobObjectMetadata = {
            provider: this.providerId,
            bucket: request.bucket ?? this._containerName,
            region: request.region,
            key,
            versionId: response.versionId,
            size: contentLength,
            contentType,
            etag: response.etag,
            checksumSha256: request.checksumSha256,
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
        const containerClient = await this.getContainerClient();
        const key = this.normalizeKey(request.key);
        const blobClient = containerClient.getBlobClient(key);

        const downloadOptions = request.versionId ? { conditions: { ifMatch: request.versionId } } : undefined;

        const response = await blobClient.download(0, undefined, downloadOptions);
        const data = await this.readResponseBody<TData>(response as unknown as Record<string, unknown>, request.responseType);

        return {
            data,
            contentType: response.contentType,
            contentLength: response.contentLength,
            metadata: response.metadata as Record<string, string> | undefined,
            rawResponse: response,
        };
    }

    /** @inheritdoc */
    public async deleteObject(request: IBlobDeleteRequest): Promise<void> {
        const containerClient = await this.getContainerClient();
        const key = this.normalizeKey(request.key);
        const blobClient = containerClient.getBlobClient(key);

        await blobClient.delete({
            deleteSnapshots: 'include',
        });

        this._logger.debug(`Deleted blob '${key}' from container '${this._containerName}'.`);
    }

    /** @inheritdoc */
    public async objectExists(request: IBlobExistsRequest): Promise<boolean> {
        const containerClient = await this.getContainerClient();
        const key = this.normalizeKey(request.key);
        const blobClient = containerClient.getBlobClient(key);

        return blobClient.exists();
    }

    /** @inheritdoc */
    public override async listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
        const containerClient = await this.getContainerClient();
        const maxKeys = Math.min(Math.max(request.maxKeys ?? 1000, 1), 5000);
        const iterator = containerClient
            .listBlobsFlat({ prefix: request.prefix })
            .byPage({ continuationToken: request.continuationToken, maxPageSize: maxKeys });

        const page = await iterator.next();

        if (page.done || !page.value) {
            return { entries: [] };
        }

        return {
            entries: page.value.segment.blobItems.map((item: { name: string; properties: { contentLength?: number; lastModified?: Date; etag?: string } }) => ({
                key: item.name,
                size: item.properties.contentLength ?? 0,
                lastModified: item.properties.lastModified,
                etag: item.properties.etag,
            })),
            continuationToken: page.value.continuationToken || undefined,
        };
    }

    /** @inheritdoc */
    public override async createSignedUrl(request: IBlobSignedUrlRequest): Promise<string> {
        const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = await this.loadSdk();
        const key = this.normalizeKey(request.key);
        const expiresInSeconds = Math.min(Math.max(request.expiresInSeconds ?? 3600, 60), 604_800);

        const { accountName, accountKey } = this.parseConnectionString();
        const credential = new StorageSharedKeyCredential(accountName, accountKey);

        const startsOn = new Date();
        const expiresOn = new Date(startsOn.getTime() + expiresInSeconds * 1000);

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: request.bucket ?? this._containerName,
                blobName: key,
                permissions: BlobSASPermissions.parse('r'),
                startsOn,
                expiresOn,
            },
            credential,
        ).toString();

        const containerClient = await this.getContainerClient();
        const blobClient = containerClient.getBlobClient(key);

        return `${blobClient.url}?${sasToken}`;
    }

    // #endregion

    // #region Helpers

    private async loadSdk(): Promise<typeof import('@azure/storage-blob')> {
        try {
            return await import('@azure/storage-blob');
        } catch {
            throw new Error('The "@azure/storage-blob" package is required for AzureBlobStorageStrategy. Install it with: npm install @azure/storage-blob');
        }
    }

    private async getContainerClient(): Promise<InstanceType<Awaited<ReturnType<typeof this.loadSdk>>['ContainerClient']>> {
        if (this._containerClient) {
            return this._containerClient as InstanceType<Awaited<ReturnType<typeof this.loadSdk>>['ContainerClient']>;
        }

        if (!this._containerClientPromise) {
            this._containerClientPromise = this.initContainerClient();
        }

        return this._containerClientPromise as Promise<InstanceType<Awaited<ReturnType<typeof this.loadSdk>>['ContainerClient']>>;
    }

    private async initContainerClient(): Promise<unknown> {
        const { BlobServiceClient } = await this.loadSdk();

        const serviceClient = BlobServiceClient.fromConnectionString(this._connectionString);

        this._containerClient = serviceClient.getContainerClient(this._containerName);

        return this._containerClient;
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

    private async readResponseBody<TData>(response: Record<string, unknown>, responseType?: string): Promise<TData> {
        const readableBody = response['readableStreamBody'] as NodeJS.ReadableStream | undefined;

        if (!readableBody) {
            return undefined as TData;
        }

        const chunks: Array<Buffer> = [];

        for await (const chunk of readableBody) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as unknown as Uint8Array));
        }

        const buffer = Buffer.concat(chunks);

        switch (responseType) {
            case 'arraybuffer':
                return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as TData;
            case 'text':
                return buffer.toString('utf-8') as TData;
            case 'json':
                try {
                    return JSON.parse(buffer.toString('utf-8')) as TData;
                } catch {
                    throw new Error('Failed to parse blob content as JSON');
                }
            case 'stream':
            default:
                return buffer as TData;
        }
    }

    private parseConnectionString(): { accountName: string; accountKey: string } {
        if (!this._connectionString) {
            throw new Error('SAS URL generation requires a connection string with shared key credentials.');
        }

        const parts = new Map(
            this._connectionString
                .split(';')
                .filter((part) => part.includes('='))
                .map((part) => {
                    const index = part.indexOf('=');

                    return [part.substring(0, index), part.substring(index + 1)] as const;
                }),
        );

        const accountName = parts.get('AccountName');
        const accountKey = parts.get('AccountKey');

        if (!accountName || !accountKey) {
            throw new Error('Could not extract AccountName and AccountKey from connection string. SAS URL generation requires a shared key credential.');
        }

        return { accountName, accountKey };
    }

    // #endregion
}
