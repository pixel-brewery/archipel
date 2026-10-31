// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import type { Dirent } from 'node:fs';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { Readable } from 'node:stream';
import {
    BlobDownloadResponseTypes,
    type IBlobDeleteRequest,
    type IBlobDownloadRequest,
    type IBlobDownloadResult,
    type IBlobExistsRequest,
    type IBlobListEntry,
    type IBlobListRequest,
    type IBlobListResult,
    type IBlobObjectMetadata,
    type IBlobUploadRequest,
    type IBlobUploadResult,
} from '../../interfaces/IBlobProvider.js';
import { BlobStorageStrategyBase } from '../abstracts/BlobStorageStrategyBase.js';
import { LOCAL_BLOB_BASE_PATH, LOCAL_BLOB_BUCKET } from './env.js';

// #endregion

/**
 * Provides a blob storage strategy backed by the local filesystem.
 *
 * @public
 */
@Injectable()
export class LocalBlobStorageStrategy extends BlobStorageStrategyBase {
    // #region Fields

    private readonly _logger = new Logger(LocalBlobStorageStrategy.name);
    private readonly _basePath: string;
    private readonly _bucket: string;
    private readonly _resolvedBasePath: string;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link LocalBlobStorageStrategy} class.
     *
     * @public
     * @param configService - The configuration service providing environment values.
     */
    public constructor(configService: ConfigService) {
        super();

        const basePath = configService.get<string>(LOCAL_BLOB_BASE_PATH.key);

        if (!basePath) {
            throw new Error('Missing local blob storage base path configuration.');
        }

        this._basePath = basePath;
        this._bucket = configService.tryGet<string>(LOCAL_BLOB_BUCKET.key, '') ?? '';
        this._resolvedBasePath = resolve(this._basePath);
    }

    // #endregion

    // #region Properties

    /** @inheritdoc */
    public readonly providerId: string = 'local';

    /** @inheritdoc */
    public get defaultBucket(): string | undefined {
        return this._bucket || undefined;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        const key = this.normalizeKey(request.key);
        const filePath = this.resolveFilePath(key, request.bucket);

        await mkdir(dirname(filePath), { recursive: true });

        const buffer = await this.toBuffer(request.body);

        await writeFile(filePath, buffer);

        this._logger.debug(`Uploaded blob to local filesystem: ${key}`);

        const fileStats = await stat(filePath);
        const etag = this.computeEtag(buffer);
        const contentType = request.contentType ?? 'application/octet-stream';

        const metadata: IBlobObjectMetadata = {
            provider: this.providerId,
            bucket: request.bucket ?? this._bucket,
            key,
            size: fileStats.size,
            contentType,
            etag,
            checksumSha256: request.checksumSha256,
            metadata: request.metadata,
            isLatest: true,
            ownerUserId: request.ownerUserId,
        };

        return { metadata };
    }

    /** @inheritdoc */
    public async downloadObject<TData>(request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>> {
        const key = this.normalizeKey(request.key);
        const filePath = this.resolveFilePath(key, request.bucket);

        const fileStats = await stat(filePath);

        if (request.responseType === BlobDownloadResponseTypes.Stream) {
            const stream = createReadStream(filePath);

            return {
                data: stream as unknown as TData,
                contentLength: fileStats.size,
            };
        }

        const buffer = await readFile(filePath);

        if (request.responseType === BlobDownloadResponseTypes.Text) {
            return {
                data: buffer.toString('utf-8') as unknown as TData,
                contentLength: fileStats.size,
            };
        }

        if (request.responseType === BlobDownloadResponseTypes.Json) {
            return {
                data: JSON.parse(buffer.toString('utf-8')) as TData,
                contentLength: fileStats.size,
            };
        }

        return {
            data: buffer as unknown as TData,
            contentLength: fileStats.size,
        };
    }

    /** @inheritdoc */
    public async deleteObject(request: IBlobDeleteRequest): Promise<void> {
        const key = this.normalizeKey(request.key);
        const filePath = this.resolveFilePath(key, request.bucket);

        await unlink(filePath);

        this._logger.debug(`Deleted blob from local filesystem: ${key}`);
    }

    /** @inheritdoc */
    public async objectExists(request: IBlobExistsRequest): Promise<boolean> {
        const key = this.normalizeKey(request.key);
        const filePath = this.resolveFilePath(key, request.bucket);
        const fileStats = await stat(filePath);

        return fileStats.isFile();
    }

    /** @inheritdoc */
    public override async listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
        const root = this.resolveFilePath('', request.bucket);
        const maxKeys = Math.min(Math.max(request.maxKeys ?? 1000, 1), 5000);
        const collected: IBlobListEntry[] = [];

        await this.collectFiles(root, '', request.prefix, collected);
        collected.sort((left, right) => left.key.localeCompare(right.key));

        const start = request.continuationToken ? collected.findIndex((entry) => entry.key > request.continuationToken!) : 0;
        const from = start < 0 ? collected.length : start;
        const page = collected.slice(from, from + maxKeys);
        const hasMore = from + maxKeys < collected.length;

        return {
            entries: page,
            continuationToken: hasMore && page.length > 0 ? page[page.length - 1].key : undefined,
        };
    }

    // #endregion

    // #region Helpers

    private async collectFiles(directory: string, relative: string, prefix: string | undefined, collected: IBlobListEntry[]): Promise<void> {
        let entries: Dirent[];

        try {
            entries = await readdir(directory, { withFileTypes: true });
        } catch {
            return;
        }

        for (const entry of entries) {
            const key = relative ? `${relative}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                await this.collectFiles(join(directory, entry.name), key, prefix, collected);
                continue;
            }

            if (prefix && !key.startsWith(prefix)) {
                continue;
            }

            const fileStats = await stat(join(directory, entry.name));
            collected.push({ key, size: fileStats.size, lastModified: fileStats.mtime });
        }
    }

    private resolveFilePath(key: string, bucket?: string): string {
        const effectiveBucket = bucket ?? this._bucket;
        const segments = effectiveBucket ? [this._resolvedBasePath, effectiveBucket, key] : [this._resolvedBasePath, key];
        const resolved = resolve(join(...segments));

        if (!resolved.startsWith(this._resolvedBasePath + sep) && resolved !== this._resolvedBasePath) {
            throw new Error('Path traversal detected: resolved path escapes the configured base path.');
        }

        return resolved;
    }

    private normalizeKey(key: string): string {
        const normalized = key.replace(/\\/g, '/').replace(/^\/+/, '');
        const segments = normalized.split('/').filter((s) => s !== '.' && s !== '..');

        // eslint-disable-next-line no-control-regex
        if (segments.some((s) => /[\x00-\x1f]/.test(s))) {
            throw new Error('Invalid blob key: control characters are not allowed.');
        }

        if (segments.length === 0 || segments.every((s) => s === '')) {
            throw new Error('Invalid blob key: key must not be empty.');
        }

        return segments.join('/');
    }

    private computeEtag(buffer: Buffer): string {
        const hash = createHash('md5').update(buffer).digest('hex');

        return `"${hash}"`;
    }

    private async toBuffer(body: Buffer | Readable): Promise<Buffer> {
        if (Buffer.isBuffer(body)) {
            return body;
        }

        const chunks: Array<Buffer> = [];

        for await (const chunk of body) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        return Buffer.concat(chunks);
    }

    // #endregion
}
