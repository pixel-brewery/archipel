// #region Interfaces

/**
 * Starts an object upload that is transferred in separately uploaded parts.
 *
 * Content type, disposition and metadata are fixed when the upload starts because some providers
 * accept them only then. The completed object carries exactly these values.
 *
 * @public
 */
export interface IBlobMultipartUploadStartRequest {
    key: string;
    contentType?: string;
    /** Value of the `Content-Disposition` header the completed object is served with. */
    contentDisposition?: string;
    metadata?: Record<string, string>;
    ownerUserId?: string;
    bucket?: string;
}

/**
 * Serializable handle of a started multipart upload.
 *
 * Callers persist it between processes to continue the same upload later. It contains no
 * credentials. Treat it as opaque apart from its documented fields.
 *
 * @public
 */
export interface IBlobMultipartUpload {
    readonly provider: string;
    readonly key: string;
    readonly bucket?: string;
    readonly uploadId: string;
    readonly contentType: string;
    readonly contentDisposition?: string;
    readonly metadata?: Readonly<Record<string, string>>;
    readonly ownerUserId?: string;
}

/**
 * Uploads one part of a started multipart upload.
 *
 * Uploading the same part number again replaces the earlier content of that part.
 *
 * @public
 */
export interface IBlobMultipartPartRequest {
    upload: IBlobMultipartUpload;
    /** Positive integer within {@link IBlobMultipartUploadLimits.maximumParts}; parts are joined in ascending order. */
    partNumber: number;
    body: Buffer;
}

/**
 * Serializable receipt of one uploaded part, required to complete the upload.
 *
 * @public
 */
export interface IBlobMultipartPart {
    readonly partNumber: number;
    /** Provider receipt of the part. Opaque to callers. */
    readonly token: string;
    readonly size: number;
}

/**
 * Completes a multipart upload from the receipts of its parts.
 *
 * @public
 */
export interface IBlobMultipartCompleteRequest {
    upload: IBlobMultipartUpload;
    /** Every part of the object exactly once; the order of this list is irrelevant. */
    parts: readonly IBlobMultipartPart[];
}

/**
 * Abandons a multipart upload and releases the parts the provider still holds.
 *
 * @public
 */
export interface IBlobMultipartAbortRequest {
    upload: IBlobMultipartUpload;
}

/**
 * Provider limits a multipart upload must respect.
 *
 * @public
 */
export interface IBlobMultipartUploadLimits {
    /** Smallest size of every part except the one with the highest part number. */
    readonly minimumPartBytes: number;
    /** Largest size of a single part. */
    readonly maximumPartBytes: number;
    /** Highest permitted part number and therefore the largest number of parts. */
    readonly maximumParts: number;
}

// #endregion
