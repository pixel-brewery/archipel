// #region Imports

import { TemplateValidationErrorBase } from './abstracts/TemplateValidationErrorBase.js';

// #endregion

/**
 * Error thrown when template validation fails for general reasons.
 *
 * @public
 */
export class GeneralTemplateValidationError extends TemplateValidationErrorBase {
    // #region Imports

    /**
     * Constructs a new instance of the `GeneralTemplateValidationError` class.
     *
     * @public
     * @param message The error message.
     * @param originalError The original error that caused the validation failure.
     */
    public constructor(
        message: string,
        public readonly originalError?: Error,
    ) {
        super(message, 'TEMPLATE_VALIDATION_FAILED');
    }

    // #endregion
}
