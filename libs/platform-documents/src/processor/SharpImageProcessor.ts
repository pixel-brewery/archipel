import { Inject, Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { IDocumentModuleOptions } from '../DocumentModule.js';
import { ImageProcessingError } from '../errors/ImageProcessingError.js';
import { IImagePayload } from '../interfaces/IImagePayload.js';
import { DOCUMENT_MODULE_OPTIONS } from '../tokens/DocumentTokens.js';
import { IImageProcessor } from './interfaces/IImageProcessor.js';

const MAX_DIMENSION = 8192;
const SHARP_INPUT_OPTIONS = { limitInputPixels: 10_000_000, sequentialRead: true } as const;
const SHARP_TIMEOUT_MS = 30_000;
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/tiff', 'image/svg+xml']);

/**
 * Sharp-based image processor.
 * Handles image resizing and format conversion.
 *
 * @public
 */
@Injectable()
export class SharpImageProcessor implements IImageProcessor {
    // #region Fields

    private readonly _logger = new Logger(SharpImageProcessor.name);
    private readonly _options: IDocumentModuleOptions;

    // #endregion

    // #region Ctor

    public constructor(@Inject(DOCUMENT_MODULE_OPTIONS) options: IDocumentModuleOptions) {
        this._options = options;
    }

    // #endregion

    // #region Methods

    /**
     * Process image payload.
     *
     * @public
     * @param payload - Image payload
     * @returns Processed payload
     */
    public async process(payload: IImagePayload): Promise<IImagePayload> {
        if (payload.mimeType && !ALLOWED_IMAGE_MIME_TYPES.has(payload.mimeType)) {
            throw new ImageProcessingError(`Unsupported image MIME type: ${payload.mimeType}`);
        }

        if (!Buffer.isBuffer(payload.data) && typeof payload.data === 'string') {
            if (!/^[A-Za-z0-9+/\n\r]+=*$/.test(payload.data)) {
                throw new ImageProcessingError('Invalid base64 input data');
            }
        }

        const buffer = Buffer.isBuffer(payload.data) ? payload.data : Buffer.from(payload.data, 'base64');
        const maxWidth = this._options.maxImageWidth ?? 800;
        const maxHeight = this._options.maxImageHeight ?? 600;
        const width = payload.width ? Math.min(Math.max(payload.width, 1), Math.min(maxWidth, MAX_DIMENSION)) : maxWidth;
        const height = payload.height ? Math.min(Math.max(payload.height, 1), Math.min(maxHeight, MAX_DIMENSION)) : maxHeight;

        this._logger.debug(
            `SharpImageProcessor processing inputBytes=${buffer.length} requestedSize=${payload.width}x${payload.height} targetSize=${width}x${height}`,
        );

        let processed: Buffer;
        try {
            processed = await this.toPng(buffer, width, height);
        } catch (e: unknown) {
            throw new ImageProcessingError('Sharp image processing failed', e);
        }

        this._logger.debug(`SharpImageProcessor processed outputBytes=${processed.length}`);

        return {
            ...payload,
            data: processed,
            width: width,
            height: height,
        };
    }

    /**
     * Convert to PNG.
     *
     * @public
     * @param buffer - Image buffer
     * @param width - Target width
     * @param height - Target height
     * @returns PNG buffer
     */
    public async toPng(buffer: Buffer, width?: number, height?: number): Promise<Buffer> {
        this._logger.debug(`SharpImageProcessor toPng resize=${!!(width || height)} targetSize=${width}x${height}`);

        let pipeline = sharp(buffer, SHARP_INPUT_OPTIONS)
            .png()
            .timeout({ seconds: SHARP_TIMEOUT_MS / 1000 });

        if (width || height) {
            pipeline = pipeline.resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        return await pipeline.toBuffer();
    }

    /**
     * Convert to JPEG.
     *
     * @public
     * @param buffer - Image buffer
     * @param width - Target width
     * @param height - Target height
     * @param quality - JPEG quality
     * @returns JPEG buffer
     */
    public async toJpeg(buffer: Buffer, width?: number, height?: number, quality = 90): Promise<Buffer> {
        let pipeline = sharp(buffer, SHARP_INPUT_OPTIONS)
            .jpeg({ quality })
            .timeout({ seconds: SHARP_TIMEOUT_MS / 1000 });

        if (width || height) {
            pipeline = pipeline.resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        }

        return await pipeline.toBuffer();
    }

    // #endregion
}
