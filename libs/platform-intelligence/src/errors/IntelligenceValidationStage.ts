// #region Imports

import type { IntelligenceValidationStages } from './IntelligenceValidationStages.js';

// #endregion

/**
 * Union type derived from {@link IntelligenceValidationStages}.
 *
 * @public
 */
export type IntelligenceValidationStage = (typeof IntelligenceValidationStages)[keyof typeof IntelligenceValidationStages];
