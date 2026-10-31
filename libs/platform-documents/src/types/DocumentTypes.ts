/**
 * Document output format types.
 *
 * @public
 */
export type DocumentFormat = 'pdf' | 'docx';

/**
 * Template format type (parser syntax).
 *
 * @public
 */
export type TemplateFormat = 'encodian' | 'mustache';

/**
 * Template type.
 *
 * @public
 */
export type TemplateType = 'docx' | 'pdf';

/**
 * Template engine type.
 *
 * @public
 */
export type EngineType = 'docx' | 'pdf';

/**
 * Image MIME type.
 *
 * @public
 */
export type ImageMimeType = 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';

/**
 * Placeholder detail for document probe report.
 *
 * @public
 */
export interface IDocumentPlaceholderDetail {
    /**
     * Original placeholder text as found in template
     */
    original: string;

    /**
     * Resolved data path
     */
    path: string;

    /**
     * Processing status
     */
    status: 'replaced' | 'notFound' | 'error';

    /**
     * Replacement value (stringified if replaced)
     */
    replacementValue?: string;

    /**
     * Reason why placeholder was not replaced or had issues
     */
    reason?: string;
}

/**
 * Document probe report.
 *
 * @public
 */
export interface IDocumentProbeReport {
    /**
     * Document format
     */
    format: DocumentFormat;

    /**
     * Total placeholders found
     */
    totalPlaceholders: number;

    /**
     * Number of placeholders successfully replaced
     */
    replacedPlaceholders: number;

    /**
     * Number of placeholders not resolved
     */
    unresolvedPlaceholders: number;

    /**
     * Whether probing succeeded
     */
    success: boolean;

    /**
     * Optional error message
     */
    errorMessage?: string;

    /**
     * Optional template identifier
     */
    templateId?: string;

    /**
     * Optional list of available data keys
     */
    dataKeys?: Array<string>;

    /**
     * Detailed placeholder information
     */
    placeholders: Array<IDocumentPlaceholderDetail>;
}

/**
 * Document render result.
 *
 * @public
 */
export interface IRenderResult {
    /**
     * Document buffer.
     */
    buffer: Buffer;

    /**
     * Document format.
     */
    format: DocumentFormat;

    /**
     * MIME type.
     */
    mimeType: string;

    /**
     * Document probe report (null if not available)
     */
    report: IDocumentProbeReport | null;
}
