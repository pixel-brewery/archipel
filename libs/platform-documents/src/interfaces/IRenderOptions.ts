import { TemplateFormat } from '../types/DocumentTypes.js';

/**
 * Options for rendering a document.
 *
 * @public
 */
export interface IRenderOptions {
    /**
     * Template identifier for registered templates.
     * Either templateId or templateBuffer must be provided.
     */
    readonly templateId?: string;

    /**
     * Template format type (encodian or mustache).
     * Defaults to 'encodian' if not specified.
     */
    readonly templateFormat?: TemplateFormat;

    /**
     * Template buffer for direct template upload.
     * Either templateId or templateBuffer must be provided.
     *
     * - Buffer: Binary document content (DOCX, PDF)
     * - string: Raw XML document content (for DOCX only)
     */
    readonly template?: Buffer | string;

    /**
     * Data payload for template placeholders.
     */
    readonly data: Record<string, unknown>;
}
