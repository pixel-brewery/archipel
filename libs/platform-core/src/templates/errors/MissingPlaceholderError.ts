// #region Imports

import { TemplateValidationErrorBase } from './abstracts/TemplateValidationErrorBase.js';

// #endregion

/**
 * Error thrown when template placeholders are missing values.
 *
 * @public
 */
export class MissingPlaceholderError extends TemplateValidationErrorBase {
    // #region Ctor

    /**
     * Constructs a new instance of the `MissingPlaceholderError` class.
     *
     * @public
     * @param placeholders Array of missing placeholder strings.
     */
    public constructor(public readonly placeholders: Array<string>) {
        super(`Missing placeholders: ${placeholders.join(', ')}`, 'MISSING_PLACEHOLDER');
    }

    // #endregion
}
