import { IRenderOptions } from '../../interfaces/IRenderOptions.js';
import { IRenderResult, DocumentFormat } from '../../types/DocumentTypes.js';

/**
 * Base interface for document renderers.
 * Each renderer handles specific document formats.
 *
 * @public
 */
export interface IDocumentRenderer {
    /**
     * Supported document formats for this renderer.
     */
    readonly supportedFormats: ReadonlyArray<DocumentFormat>;

    /**
     * Render a document from template with provided data.
     *
     * @param options - Render options
     * @returns Render result with buffer and metadata
     */
    render(options: IRenderOptions): Promise<IRenderResult>;
}
