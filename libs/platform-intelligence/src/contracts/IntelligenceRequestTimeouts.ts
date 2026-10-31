// #region Imports

import type { IntelligenceCapability } from './IntelligenceCapability.js';

// #endregion

/**
 * Capability-specific total request timeouts in milliseconds.
 *
 * @public
 */
export type IntelligenceRequestTimeouts = Readonly<Partial<Record<IntelligenceCapability, number>>>;
