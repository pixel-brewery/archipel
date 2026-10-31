// #region Imports

import type { IIntelligenceModelReference } from './IIntelligenceModelReference.js';
import type { IntelligenceCapability } from './IntelligenceCapability.js';

// #endregion

/**
 * Capability-specific default provider and model references.
 *
 * @public
 */
export type IntelligenceDefaultModels = Readonly<Partial<Record<IntelligenceCapability, IIntelligenceModelReference>>>;
