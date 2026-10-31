import { ImageMimeType } from '../types/DocumentTypes.js';

/**
 * Image payload for templates.
 *
 * @public
 */
export interface IImagePayload {
    /**
     * Image data (Buffer or base64 string).
     */
    data: Buffer | string;

    /**
     * Desired width in pixels.
     */
    width?: number;

    /**
     * Desired height in pixels.
     */
    height?: number;

    /**
     * Image MIME type.
     */
    mimeType?: ImageMimeType;
}
