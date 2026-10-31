// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import type { AxiosRequestConfig, ResponseType as AxiosResponseType, RawAxiosResponseHeaders } from 'axios';
import { lastValueFrom } from 'rxjs';
import {
    BlobDownloadResponseTypes,
    type BlobDownloadResponseType,
    type IBlobDeleteRequest,
    type IBlobDownloadRequest,
    type IBlobDownloadResult,
    type IBlobExistsRequest,
    type IBlobListRequest,
    type IBlobListResult,
    type IBlobObjectMetadata,
    type IBlobSignedUrlRequest,
    type IBlobUploadRequest,
    type IBlobUploadResult,
} from '../../interfaces/IBlobProvider.js';
import { BlobStorageStrategyBase } from '../abstracts/BlobStorageStrategyBase.js';
import { VERCEL_BLOB_BUCKET, VERCEL_BLOB_PUBLIC_URL, VERCEL_BLOB_READ_WRITE_TOKEN, VERCEL_BLOB_REGION, VERCEL_BLOB_URL } from './env.js';

// #endregion

/**
 * Provides a blob storage strategy backed by the Vercel Blob API.
 *
 * @public
 */
@Injectable()
export class VercelBlobStorageStrategy extends BlobStorageStrategyBase {
    // #region Fields

    private readonly _httpService: HttpService;
    private readonly _logger = new Logger(VercelBlobStorageStrategy.name);
    private readonly _apiUrl: string;
    private readonly _accessToken: string;
    private readonly _bucket: string;
    private readonly _region: string;
    private readonly _publicUrl: string;
    private readonly _timeoutMs: number = 30_000;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link VercelBlobStorageStrategy} class.
     *
     * @public
     * @param httpService - The HTTP service used to communicate with the Vercel Blob API.
     * @param configService - The configuration service providing environment values.
     */
    public constructor(httpService: HttpService, configService: ConfigService) {
        super();

        const apiUrl = configService.get<string>(VERCEL_BLOB_URL.key);
        const accessToken = configService.get<string>(VERCEL_BLOB_READ_WRITE_TOKEN.key);

        if (!apiUrl) {
            throw new Error('Missing Vercel Blob API URL configuration.');
        }

        if (!accessToken) {
            throw new Error('Missing Vercel Blob access token configuration.');
        }

        this._httpService = httpService;
        this._apiUrl = apiUrl.replace(/\/$/, '');
        this._accessToken = accessToken;
        this._bucket = configService.tryGet<string>(VERCEL_BLOB_BUCKET.key, '') ?? '';
        this._region = configService.tryGet<string>(VERCEL_BLOB_REGION.key, '') ?? '';
        this._publicUrl = configService.tryGet<string>(VERCEL_BLOB_PUBLIC_URL.key, '')?.replace(/\/$/, '') ?? this._apiUrl;
    }

    // #endregion

    // #region Properties

    /** @inheritdoc */
    public readonly providerId: string = 'vercel';

    /** @inheritdoc */
    public get defaultBucket(): string | undefined {
        return this._bucket || undefined;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async uploadObject(request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        const key = this.normalizeKey(request.key);
        const url = this.buildApiUrl(key, request.bucket);
        const headers = this.createAuthorizationHeaders();
        const contentType = request.contentType ?? 'application/octet-stream';
        headers['Content-Type'] = contentType;

        const contentLength = this.resolveContentLength(request);
        if (contentLength > 0) {
            headers['Content-Length'] = contentLength.toString();
        }

        const axiosConfig: AxiosRequestConfig<IBlobUploadRequest['body']> = {
            headers,
            maxBodyLength: Infinity,
            timeout: this._timeoutMs,
        };

        const response = await lastValueFrom(this._httpService.put(url, request.body, axiosConfig));
        const metadata = this.createMetadataFromUpload(request, response.headers, key, contentType, contentLength);

        return {
            metadata,
            rawResponse: response.data,
        };
    }

    /** @inheritdoc */
    public async downloadObject<TData>(request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>> {
        const key = this.normalizeKey(request.key);
        const url = this.buildApiUrl(key, request.bucket, request.versionId);
        const responseType = this.mapResponseType(request.responseType);

        const axiosConfig: AxiosRequestConfig = {
            headers: this.createAuthorizationHeaders(),
            responseType,
            timeout: this._timeoutMs,
        };

        const response = await lastValueFrom(this._httpService.get<TData>(url, axiosConfig));

        return {
            data: response.data,
            contentLength: this.tryParseNumberHeader(response.headers, 'content-length'),
            contentType: this.tryReadHeader(response.headers, 'content-type'),
            rawResponse: response.data,
        };
    }

    /** @inheritdoc */
    public async deleteObject(request: IBlobDeleteRequest): Promise<void> {
        const key = this.normalizeKey(request.key);
        const url = this.buildApiUrl(key, request.bucket, request.versionId);

        const axiosConfig: AxiosRequestConfig = {
            headers: this.createAuthorizationHeaders(),
            timeout: this._timeoutMs,
        };

        await lastValueFrom(this._httpService.delete(url, axiosConfig));
    }

    /** @inheritdoc */
    public async objectExists(request: IBlobExistsRequest): Promise<boolean> {
        const key = this.normalizeKey(request.key);
        const url = this.buildApiUrl(key, request.bucket, request.versionId);
        const axiosConfig: AxiosRequestConfig = {
            headers: this.createAuthorizationHeaders(),
            timeout: this._timeoutMs,
        };

        await lastValueFrom(this._httpService.head(url, axiosConfig));

        return true;
    }

    /** @inheritdoc */
    public override async listObjects(request: IBlobListRequest = {}): Promise<IBlobListResult> {
        const axiosConfig: AxiosRequestConfig = {
            headers: this.createAuthorizationHeaders(),
            timeout: this._timeoutMs,
            params: {
                prefix: request.prefix,
                cursor: request.continuationToken,
                limit: Math.min(Math.max(request.maxKeys ?? 1000, 1), 1000),
            },
        };

        const response = await lastValueFrom(this._httpService.get<IVercelBlobListResponse>(this.buildListUrl(request.bucket), axiosConfig));

        return {
            entries: (response.data?.blobs ?? []).map((blob) => ({
                key: blob.pathname,
                size: blob.size ?? 0,
                lastModified: blob.uploadedAt ? new Date(blob.uploadedAt) : undefined,
            })),
            continuationToken: response.data?.hasMore ? (response.data.cursor ?? undefined) : undefined,
        };
    }

    /** @inheritdoc */
    public override async createSignedUrl(request: IBlobSignedUrlRequest): Promise<string> {
        const key = this.normalizeKey(request.key);

        return this.buildPublicUrl(key, request.bucket, request.versionId);
    }

    // #endregion

    // #region Helpers

    private buildListUrl(bucket?: string): string {
        const bucketSegment = bucket ? `${bucket.replace(/\/$/, '')}/` : '';

        return `${this._apiUrl}/${bucketSegment}`;
    }

    private buildApiUrl(key: string, bucket?: string, versionId?: string): string {
        const bucketSegment = bucket ? `${bucket.replace(/\/$/, '')}/` : '';
        const baseUrl = `${this._apiUrl}/${bucketSegment}${key}`;

        if (!versionId) {
            return baseUrl;
        }

        const separator = baseUrl.includes('?') ? '&' : '?';

        return `${baseUrl}${separator}versionId=${encodeURIComponent(versionId)}`;
    }

    private buildPublicUrl(key: string, bucket?: string, versionId?: string): string {
        const bucketSegment = bucket ? `${bucket.replace(/\/$/, '')}/` : '';
        const baseUrl = `${this._publicUrl}/${bucketSegment}${key}`;

        if (!versionId) {
            return baseUrl;
        }

        const separator = baseUrl.includes('?') ? '&' : '?';

        return `${baseUrl}${separator}versionId=${encodeURIComponent(versionId)}`;
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

    private createAuthorizationHeaders(): Record<string, string> {
        return {
            Authorization: `Bearer ${this._accessToken}`,
        };
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

    private mapResponseType(responseType?: BlobDownloadResponseType): AxiosResponseType {
        switch (responseType) {
            case BlobDownloadResponseTypes.ArrayBuffer:
                return 'arraybuffer';
            case BlobDownloadResponseTypes.Json:
                return 'json';
            case BlobDownloadResponseTypes.Stream:
                return 'stream';
            case BlobDownloadResponseTypes.Text:
                return 'text';
            default:
                return 'arraybuffer';
        }
    }

    private createMetadataFromUpload(
        request: IBlobUploadRequest,
        headers: RawAxiosResponseHeaders,
        key: string,
        contentType: string,
        contentLength: number,
    ): IBlobObjectMetadata {
        return {
            provider: this.providerId,
            bucket: request.bucket ?? this._bucket,
            region: request.region ?? this._region,
            key,
            versionId: this.tryReadHeader(headers, 'x-amz-version-id'),
            size: contentLength,
            contentType,
            etag: this.tryReadHeader(headers, 'etag'),
            checksumSha256: request.checksumSha256 ?? this.tryReadHeader(headers, 'x-amz-checksum-sha256'),
            storageClass: this.tryReadHeader(headers, 'x-amz-storage-class'),
            metadata: request.metadata,
            isLatest: true,
            ownerUserId: request.ownerUserId,
        };
    }

    private tryReadHeader(headers: RawAxiosResponseHeaders, headerName: string): string | undefined {
        const headerKey = headerName.toLowerCase();
        const rawValue = headers[headerKey];

        if (typeof rawValue === 'string') {
            return rawValue;
        }

        if (Array.isArray(rawValue)) {
            const [first] = rawValue;

            return first;
        }

        return undefined;
    }

    private tryParseNumberHeader(headers: RawAxiosResponseHeaders, headerName: string): number | undefined {
        const value = this.tryReadHeader(headers, headerName);

        if (!value) {
            return undefined;
        }

        const parsed = Number.parseInt(value, 10);

        return Number.isNaN(parsed) ? undefined : parsed;
    }

    // #endregion
}

// #region Interfaces

/**
 * Shape of the provider's listing response.
 *
 * Declared locally because it belongs to the provider's HTTP API rather than to the storage
 * abstraction, which must not leak provider specifics.
 *
 * @internal
 */
interface IVercelBlobListResponse {
    blobs?: { pathname: string; size?: number; uploadedAt?: string }[];
    cursor?: string | null;
    hasMore?: boolean;
}

// #endregion
