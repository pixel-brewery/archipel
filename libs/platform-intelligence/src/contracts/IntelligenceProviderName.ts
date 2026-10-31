// #region Imports

import type { IntelligenceProviderNames } from './IntelligenceProviderNames.js';

// #endregion

/**
 * Represents the union of supported intelligence provider identifiers.
 *
 * @public
 */
export type IntelligenceProviderName = (typeof IntelligenceProviderNames)[keyof typeof IntelligenceProviderNames];
