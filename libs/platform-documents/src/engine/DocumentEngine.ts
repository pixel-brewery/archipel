import { getMimeTypeByFileNameOrExtension } from '@pixel-brewery/archipel-platform-core/mime-utils';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { extname } from 'node:path';
import type { IDocumentModuleOptions } from '../DocumentModule.js';
import { DocumentRenderError } from '../errors/DocumentRenderError.js';
import { DocumentValidationError } from '../errors/DocumentValidationError.js';
import { IRenderOptions } from '../interfaces/IRenderOptions.js';
import { IDocumentRenderer } from '../renderer/interfaces/IDocumentRenderer.js';
import { DOCUMENT_MODULE_OPTIONS, DOCUMENT_RENDERER_TOKEN } from '../tokens/DocumentTokens.js';
import { DocumentFormat, IRenderResult } from '../types/DocumentTypes.js';

/**
 * DocumentEngine orchestrates document generation workflow.
 * Coordinates resource loading and renderer components.
 *
 * @public
 */
@Injectable()
export class DocumentEngine {
    // #region Fields

    private readonly _resourceManager: ResourceManager;
    private readonly _renderers: Map<string, IDocumentRenderer>;
    private readonly _logger = new Logger(DocumentEngine.name);
    private readonly _debug: boolean;

    // #endregion

    // #region Properties

    /**
     * Get available renderers.
     *
     * @public
     * @returns Map of format to renderer
     */
    public get renderers(): ReadonlyMap<string, IDocumentRenderer> {
        return this._renderers;
    }

    // #endregion

    // #region Ctor

    public constructor(
        resourceManager: ResourceManager,
        @Inject(DOCUMENT_RENDERER_TOKEN) renderers: Array<IDocumentRenderer>,
        @Inject(DOCUMENT_MODULE_OPTIONS) options: IDocumentModuleOptions,
    ) {
        this._resourceManager = resourceManager;
        this._renderers = new Map();
        this._debug = options.debug ?? false;

        for (const renderer of renderers) {
            for (const format of renderer.supportedFormats) {
                this._renderers.set(format, renderer);
            }
        }

        if (this._debug) {
            this._logger.debug(`DocumentEngine initialized formats=${Array.from(this._renderers.keys()).join(',')}`);
        }
    }

    // #endregion

    // #region Methods

    /**
     * Render a document from template.
     *
     * @public
     * @param options - Render options
     * @returns Render result with buffer and metadata
     */
    public async render(options: IRenderOptions): Promise<IRenderResult & { name: string }> {
        const source = options.templateId ? `id=${options.templateId}` : 'buffer';
        this._logger.log(`Rendering document source=${source}`);

        // Determine template format and get appropriate renderer
        let templateFormat: DocumentFormat;
        let templateName: string;
        let renderer: IDocumentRenderer | undefined;

        if (options.template) {
            // For uploaded templates, detect format from buffer (magic bytes or assume DOCX)
            templateFormat = this.detectFormatFromBuffer(options.template);
            templateName = this.detectNameFromBuffer(options.template);
            const size = typeof options.template === 'string' ? options.template.length : options.template.length;
            if (this._debug) {
                this._logger.debug(`Detected format=${templateFormat} size=${size} type=${typeof options.template}`);
            }
            renderer = this._renderers.get(templateFormat);
        } else if (options.templateId) {
            // Sanitize templateId to prevent path traversal and SSRF
            // eslint-disable-next-line no-control-regex
            if (/\.\.[\\/]|[\x00-\x1f]|^https?:/i.test(options.templateId)) {
                throw new DocumentValidationError(`Invalid templateId: '${options.templateId}'`);
            }

            // For resource-based templates, get from ResourceManager and detect format
            const resource = await this._resourceManager.loadAsync(options.templateId);
            const extension = extname(resource.metadata.path).toLowerCase().replace('.', '') as DocumentFormat;
            templateFormat = extension;
            templateName = resource.metadata.path.split('/').pop() ?? resource.metadata.path;
            if (this._debug) {
                this._logger.debug(`Loaded template id=${options.templateId} format=${templateFormat} path=${resource.metadata.path}`);
            }
            renderer = this._renderers.get(templateFormat);
        } else {
            throw new DocumentValidationError('Either templateId or templateBuffer must be provided');
        }

        if (!renderer) {
            this._logger.error(`No renderer available format=${templateFormat}`);
            throw new DocumentRenderError(`No renderer available for format: ${templateFormat}`);
        }

        if (this._debug) {
            this._logger.debug(`Using renderer=${renderer.constructor.name}`);
        }

        let result = await renderer.render(options);

        // Apply MIME type
        const mimeType = getMimeTypeByFileNameOrExtension(`.${result.format}`) || `application/${result.format}`;
        result = {
            ...result,
            mimeType: mimeType,
        };

        this._logger.log(`Document rendered format=${result.format} bytes=${result.buffer.length} mime=${result.mimeType}`);

        return {
            ...result,
            name: templateName,
        };
    }

    /**
     * Detect document format from buffer or string content.
     *
     * @private
     * @param buffer - Document buffer or raw XML string
     * @returns Detected format
     */
    private detectFormatFromBuffer(buffer: Buffer | string): DocumentFormat {
        // Handle string input (raw XML for DOCX)
        if (typeof buffer === 'string') {
            if (this._debug) this._logger.debug('Format detection docx (raw XML)');
            return 'docx';
        }

        // Check for PDF magic bytes
        if (buffer.toString('utf8', 0, 4) === '%PDF') {
            if (this._debug) this._logger.debug('Format detection pdf');
            return 'pdf';
        }

        // Check for DOCX (ZIP) magic bytes (PK\x03\x04)
        if (buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
            if (this._debug) this._logger.debug('Format detection docx');
            return 'docx';
        }

        // Default to DOCX for unknown formats
        if (this._debug) this._logger.debug('Format detection docx');
        return 'docx';
    }

    /**
     * Detect document name from buffer or string content.
     *
     * @private
     * @param buffer - Document buffer or raw XML string
     * @returns Detected name
     */
    private detectNameFromBuffer(_buffer: Buffer | string): string {
        // Placeholder for future implementation if needed
        return 'document';
    }

    // #endregion
}
