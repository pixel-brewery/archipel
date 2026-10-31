import { IResourceMetadata } from './IResourceMetadata.js';

/**
 * Result of loading a resource.
 *
 * @public
 */
export interface IResourceResult {
    /**
     * The resource content as a Buffer.
     */
    content: Buffer;

    /**
     * Metadata about the resource.
     */
    metadata: IResourceMetadata;
}
