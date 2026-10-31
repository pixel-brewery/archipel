// #region Imports

import type { Readable } from 'node:stream';

// #endregion

// #region Types

export const BlobDownloadResponseTypes = {
    ArrayBuffer: 'arraybuffer',
    Json: 'json',
    Stream: 'stream',
    Text: 'text',
} as const;

export type BlobDownloadResponseType = (typeof BlobDownloadResponseTypes)[keyof typeof BlobDownloadResponseTypes];

export type BlobUploadBody = Buffer | Readable;

// #endregion

// #region Interfaces

export interface IBlobObjectMetadata {
    provider: string;
    bucket: string;
    region?: string;
    key: string;
    versionId?: string;
    size: number;
    contentType: string;
    etag?: string;
    checksumSha256?: string;
    storageClass?: string;
    metadata?: Record<string, string>;
    isLatest: boolean;
    ownerUserId?: string;
}

export interface IBlobUploadRequest {
    key: string;
    body: BlobUploadBody;
    contentType?: string;
    contentLength?: number;
    metadata?: Record<string, string>;
    checksumSha256?: string;
    ownerUserId?: string;
    bucket?: string;
    region?: string;
}

export interface IBlobUploadResult {
    metadata: IBlobObjectMetadata;
    rawResponse?: unknown;

    /**
     * Whether the registered persistence abstract base recorded this object.
     *
     * The object is already stored when the abstract base runs, so a failing abstract base must not fail the upload.
     * Callers that keep their own accounting use this flag to detect the resulting drift instead of
     * having to choose between losing a successful upload and swallowing the error silently.
     *
     * `undefined` when no persistence abstract base is registered.
     */
    metadataPersisted?: boolean;
}

/**
 * Storage operations that not every provider can perform.
 *
 * Providers differ in what their backing store supports. Rather than growing one boolean per
 * capability, callers ask for the operation they intend to use.
 *
 * @public
 * @readonly
 */
export const BlobOptionalOperation = {
    CreateSignedUrl: 'createSignedUrl',
    ListObjects: 'listObjects',
} as const;

/**
 * An operation that a provider may or may not support.
 *
 * @public
 */
export type BlobOptionalOperation = (typeof BlobOptionalOperation)[keyof typeof BlobOptionalOperation];

/**
 * Describes one page of a bucket listing.
 *
 * @public
 */
export interface IBlobListRequest {
    /** Restricts the listing to keys starting with this prefix. */
    prefix?: string;

    /** Continuation token of a previous page; omit to start at the beginning. */
    continuationToken?: string;

    /** Upper bound of entries per page. Providers may return fewer. */
    maxKeys?: number;

    bucket?: string;
}

/**
 * One object of a bucket listing.
 *
 * Listings carry only what every provider reports cheaply. Anything beyond that requires a
 * per-object head request and is deliberately not part of a listing.
 *
 * @public
 */
export interface IBlobListEntry {
    key: string;
    size: number;
    lastModified?: Date;
    etag?: string;
}

/**
 * One page of a bucket listing.
 *
 * @public
 */
export interface IBlobListResult {
    entries: IBlobListEntry[];

    /** Token to pass to the next call; absent when the listing is complete. */
    continuationToken?: string;
}

export interface IBlobDownloadRequest {
    key: string;
    versionId?: string;
    responseType?: BlobDownloadResponseType;
    bucket?: string;
}

export interface IBlobDownloadResult<TData> {
    data: TData;
    contentType?: string;
    contentLength?: number;
    metadata?: Record<string, string>;
    rawResponse?: unknown;
}

export interface IBlobDeleteRequest {
    key: string;
    versionId?: string;
    bucket?: string;
}

export interface IBlobExistsRequest {
    key: string;
    versionId?: string;
    bucket?: string;
}

export interface IBlobSignedUrlRequest {
    key: string;
    expiresInSeconds?: number;
    bucket?: string;
    versionId?: string;
}

// #endregion
