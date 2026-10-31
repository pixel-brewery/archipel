// #region Imports

import type { IntelligenceCapabilityNames } from './IntelligenceCapabilityNames.js';

// #endregion

/**
 * Intelligence capability identifier.
 *
 * @public
 */
export type IntelligenceCapability = (typeof IntelligenceCapabilityNames)[keyof typeof IntelligenceCapabilityNames];
