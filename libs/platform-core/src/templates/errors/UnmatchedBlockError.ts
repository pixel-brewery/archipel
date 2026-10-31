// #region Imports

import { TemplateValidationErrorBase } from './abstracts/TemplateValidationErrorBase.js';

// #endregion

/**
 * Error thrown when template blocks are unmatched (e.g., missing closing tags).
 *
 * @public
 */
export class UnmatchedBlockError extends TemplateValidationErrorBase {
    // #region Ctor

    /**
     * Constructs a new instance of the `UnmatchedBlockError` class.
     *
     * @public
     * @param blockType The type of block that is unmatched (e.g., 'each', 'if', 'unless', 'with').
     */
    public constructor(public readonly blockType: string) {
        super(`Unmatched {{#${blockType}}} blocks.`, 'UNMATCHED_BLOCK');
    }

    // #endregion
}
