import { DocumentErrorBase } from './abstracts/DocumentErrorBase.js';

/**
 * Thrown when document input validation fails.
 *
 * @public
 */
export class DocumentValidationError extends DocumentErrorBase {
    // #region Ctor

    public constructor(message: string) {
        super(message, 'DOCUMENT_VALIDATION');
        this.name = 'DocumentValidationError';
    }

    // #endregion
}
