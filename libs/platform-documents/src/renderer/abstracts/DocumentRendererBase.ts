import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { Inject } from '@nestjs/common';
import type { RequiredDeep } from 'type-fest';
import { IDocumentModuleOptions } from '../../DocumentModule.js';
import { IImagePayload } from '../../interfaces/IImagePayload.js';
import { IRenderOptions } from '../../interfaces/IRenderOptions.js';
import { IImageProcessor } from '../../processor/interfaces/IImageProcessor.js';
import { DOCUMENT_MODULE_OPTIONS, IMAGE_PROCESSOR_TOKEN } from '../../tokens/DocumentTokens.js';
import { DocumentFormat, IRenderResult } from '../../types/DocumentTypes.js';
import { IDocumentRenderer } from '../interfaces/IDocumentRenderer.js';

/**
 * Base class for document renderers.
 * Provides common functionality for template loading, parsing, and image processing.
 *
 * @public
 */
export abstract class DocumentRendererBase implements IDocumentRenderer {
    // #region Fields

    protected readonly _options: RequiredDeep<IDocumentModuleOptions>;

    protected readonly _resourceManager: ResourceManager;

    protected readonly _imageProcessor: IImageProcessor;

    // #endregion

    // #region Ctor

    public constructor(
        @Inject(DOCUMENT_MODULE_OPTIONS) options: RequiredDeep<IDocumentModuleOptions>,
        resourceManager: ResourceManager,
        @Inject(IMAGE_PROCESSOR_TOKEN) imageProcessor: IImageProcessor,
    ) {
        this._options = options;
        this._resourceManager = resourceManager;
        this._imageProcessor = imageProcessor;
    }

    // #endregion

    // #region Properties

    /**
     * Supported document formats for this renderer.
     */
    public abstract get supportedFormats(): ReadonlyArray<DocumentFormat>;

    // #endregion

    // #region Methods

    /**
     * Render a document from template with provided data.
     *
     * @param options - Render options
     * @returns Render result with buffer and metadata
     */
    public abstract render(options: IRenderOptions): Promise<IRenderResult>;

    /**
     * Preprocess template data (process images).
     * Template syntax processing is handled later by parser.processXml().
     *
     * @protected
     * @param data - Raw template data
     * @returns Processed data
     */
    protected async preprocessData(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        return await this.processImages(data);
    }

    /**
     * Process image payloads in data.
     *
     * @protected
     * @param data - Data object
     * @returns Data with processed images
     */
    protected async processImages(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        const processed: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            if (this.isImagePayload(value)) {
                processed[key] = await this._imageProcessor.process(value as IImagePayload);
            } else if (Array.isArray(value)) {
                processed[key] = await Promise.all(value.map((item) => (this.isImagePayload(item) ? this._imageProcessor.process(item) : item)));
            } else if (typeof value === 'object' && value !== null) {
                processed[key] = await this.processImages(value as Record<string, unknown>);
            } else {
                processed[key] = value;
            }
        }

        return processed;
    }

    /**
     * Check if value is an image payload.
     *
     * @protected
     * @param value - Value to check
     * @returns True if image payload
     */
    protected isImagePayload(value: unknown): boolean {
        return typeof value === 'object' && value !== null && 'data' in value && ('width' in value || 'height' in value);
    }

    // #endregion
}
