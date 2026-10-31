// #region Imports

import type { IntelligenceJsonValue } from './IntelligenceJsonValue.js';

// #endregion

/**
 * Provider-specific request options kept behind an explicit escape hatch.
 *
 * @public
 */
export type IntelligenceProviderOptions = Readonly<Record<string, Readonly<Record<string, IntelligenceJsonValue>>>>;
