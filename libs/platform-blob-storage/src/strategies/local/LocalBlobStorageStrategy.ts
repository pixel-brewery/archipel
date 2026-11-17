// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import type { Dirent } from 'node:fs';
import { mkdir, readdir, readFile, rename, rm, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
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

    /** Reserved directory below the base path that holds the parts of unfinished multipart uploads. */
    private static readonly MULTIPART_DIRECTORY = '.archipel-multipart';
    private static readonly UPLOAD_ID_PATTERN = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/;

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
    public override readonly multipartUploadLimits: IBlobMultipartUploadLimits = {
        minimumPartBytes: 1,
        maximumPartBytes: 512 * 1024 * 1024,
        maximumParts: 10_000,
    };

    /** @inheritdoc */
    public get defaultBucket(): string | undefined {
        return this._bucket || undefined;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        assertBlobExecutionSupport(this, 'uploadObject', request.key, request.execution);
        const key = this.normalizeKey(request.key);
        const filePath = this.resolveFilePath(key, request.bucket);

        await mkdir(dirname(filePath), { recursive: true });

        const buffer = await this.toBuffer(request.body);

        await writeFile(filePath, buffer);

        this._logger.debug({ operation: 'blobObject.upload', providerId: this.providerId, result: 'succeeded' });

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
        assertBlobExecutionSupport(this, 'downloadObject', request.key, request.execution, request.maxBytes);
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

        this._logger.debug({ operation: 'blobObject.delete', providerId: this.providerId, result: 'succeeded' });
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
        assertBlobExecutionSupport(this, 'listObjects', request.prefix ?? '', request.execution);
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

    /** @inheritdoc */
    public override async createMultipartUpload(request: IBlobMultipartUploadStartRequest): Promise<IBlobMultipartUpload> {
        const key = this.normalizeKey(request.key);
        this.resolveFilePath(key, request.bucket);
        const uploadId = randomUUID();
        await mkdir(this.resolveMultipartDirectory(uploadId), { recursive: true });

        return {
            provider: this.providerId,
            key,
            ...(request.bucket !== undefined ? { bucket: request.bucket } : {}),
            uploadId,
            contentType: request.contentType ?? 'application/octet-stream',
            ...(request.contentDisposition !== undefined ? { contentDisposition: request.contentDisposition } : {}),
            ...(request.metadata !== undefined ? { metadata: { ...request.metadata } } : {}),
            ...(request.ownerUserId !== undefined ? { ownerUserId: request.ownerUserId } : {}),
        };
    }

    /** @inheritdoc */
    public override async uploadMultipartPart(request: IBlobMultipartPartRequest): Promise<IBlobMultipartPart> {
        const directory = this.resolveMultipartDirectory(request.upload.uploadId);
        await stat(directory);
        await writeFile(join(directory, this.partFileName(request.partNumber)), request.body);

        return { partNumber: request.partNumber, token: this.computeEtag(request.body), size: request.body.length };
    }

    /** @inheritdoc */
    public override async completeMultipartUpload(request: IBlobMultipartCompleteRequest): Promise<IBlobUploadResult> {
        const { upload } = request;
        const key = this.normalizeKey(upload.key);
        const filePath = this.resolveFilePath(key, upload.bucket);
        const directory = this.resolveMultipartDirectory(upload.uploadId);
        const parts = [...request.parts].sort((left, right) => left.partNumber - right.partNumber);
        const temporaryPath = `${filePath}.${upload.uploadId}.partial`;
        const hash = createHash('md5');

        await mkdir(dirname(filePath), { recursive: true });
        try {
            const output = createWriteStream(temporaryPath);
            await pipeline(Readable.from(this.readParts(directory, parts, hash)), output);
            await rename(temporaryPath, filePath);
        } catch (error: unknown) {
            await rm(temporaryPath, { force: true });
            throw error;
        }
        await rm(directory, { recursive: true, force: true });

        const fileStats = await stat(filePath);

        return {
            metadata: {
                provider: this.providerId,
                bucket: upload.bucket ?? this._bucket,
                key,
                size: fileStats.size,
                contentType: upload.contentType,
                etag: `"${hash.digest('hex')}"`,
                ...(upload.metadata !== undefined ? { metadata: { ...upload.metadata } } : {}),
                isLatest: true,
                ownerUserId: upload.ownerUserId,
            },
        };
    }

    /** @inheritdoc */
    public override async abortMultipartUpload(request: IBlobMultipartAbortRequest): Promise<void> {
        await rm(this.resolveMultipartDirectory(request.upload.uploadId), { recursive: true, force: true });
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

            if (!relative && directory === this._resolvedBasePath && entry.name === LocalBlobStorageStrategy.MULTIPART_DIRECTORY) {
                continue;
            }

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

    private async *readParts(directory: string, parts: readonly IBlobMultipartPart[], hash: ReturnType<typeof createHash>): AsyncGenerator<Buffer> {
        for (const part of parts) {
            const content = await readFile(join(directory, this.partFileName(part.partNumber)));
            if (content.length !== part.size || this.computeEtag(content) !== part.token) {
                throw new Error(`Multipart upload part ${part.partNumber} does not match its receipt.`);
            }
            hash.update(content);
            yield content;
        }
    }

    private resolveMultipartDirectory(uploadId: string): string {
        if (!LocalBlobStorageStrategy.UPLOAD_ID_PATTERN.test(uploadId)) {
            throw new Error('Invalid multipart upload identifier.');
        }

        return join(this._resolvedBasePath, LocalBlobStorageStrategy.MULTIPART_DIRECTORY, uploadId);
    }

    private partFileName(partNumber: number): string {
        return `${partNumber.toString().padStart(5, '0')}.part`;
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
