/**
 * Metadata about a resource.
 *
 * @public
 */
export interface IResourceMetadata {
    /**
     * The resource key/identifier.
     */
    key: string;

    /**
     * The full path of the resource.
     */
    path: string;

    /**
     * The MIME type of the resource.
     */
    mimeType: string;

    /**
     * The size of the resource in bytes.
     */
    size: number;

    /**
     * The encoding of the resource (if applicable).
     */
    encoding?: NodeJS.BufferEncoding;

    /**
     * The source strategy that resolved this resource.
     */
    source: string;

    /**
     * When this resource was cached (if applicable).
     */
    cachedAt?: Date;
}
