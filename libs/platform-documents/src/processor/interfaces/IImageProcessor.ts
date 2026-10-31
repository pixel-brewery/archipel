import { IImagePayload } from '../../interfaces/IImagePayload.js';

/**
 * Base interface for image processors.
 * Handles image manipulation and format conversion.
 *
 * @public
 */
export interface IImageProcessor {
    /**
     * Process image payload (resize, format conversion).
     *
     * @param payload - Image payload
     * @returns Processed image payload
     */
    process(payload: IImagePayload): Promise<IImagePayload>;

    /**
     * Convert image to PNG format.
     *
     * @param buffer - Image buffer
     * @param width - Target width
     * @param height - Target height
     * @returns PNG buffer
     */
    toPng(buffer: Buffer, width?: number, height?: number): Promise<Buffer>;

    /**
     * Convert image to JPEG format.
     *
     * @param buffer - Image buffer
     * @param width - Target width
     * @param height - Target height
     * @param quality - JPEG quality (0-100)
     * @returns JPEG buffer
     */
    toJpeg(buffer: Buffer, width?: number, height?: number, quality?: number): Promise<Buffer>;
}
