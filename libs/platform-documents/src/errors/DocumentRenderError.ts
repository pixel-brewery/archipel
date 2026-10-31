import { DocumentErrorBase } from './abstracts/DocumentErrorBase.js';

/**
 * Thrown when document rendering fails.
 *
 * @public
 */
export class DocumentRenderError extends DocumentErrorBase {
    // #region Ctor

    public constructor(message: string, cause?: unknown) {
        super(message, 'DOCUMENT_RENDER', cause);
        this.name = 'DocumentRenderError';
    }

    // #endregion
}
