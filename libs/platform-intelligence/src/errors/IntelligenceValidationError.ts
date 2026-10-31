// #region Imports

import { type IntelligenceValidationStage } from './IntelligenceValidationStage.js';
import { IntelligenceValidationStages } from './IntelligenceValidationStages.js';

// #endregion

/**
 * Error thrown when an intelligence input validation fails.
 *
 * @remarks
 * {@link IntelligenceValidationError.stage} tells an invalid request apart
 * from an unusable provider answer: `input` for a request, prompt, option or
 * tool configuration the application built before any provider call, and
 * `output` for a provider answer that violates the output contract.
 *
 * @public
 */
export class IntelligenceValidationError extends Error {
    // #region Fields

    public readonly code = 'INTELLIGENCE_VALIDATION';

    /** Which side of the provider call failed validation. */
    public readonly stage: IntelligenceValidationStage;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `IntelligenceValidationError` class.
     *
     * @param message - Diagnostic message.
     * @param stage - Which side of the provider call failed validation. Defaults to `input`.
     */
    public constructor(message: string, stage: IntelligenceValidationStage = IntelligenceValidationStages.Input) {
        super(message);
        this.name = 'IntelligenceValidationError';
        this.stage = stage;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    // #endregion
}
