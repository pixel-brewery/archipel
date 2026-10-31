// #region Imports

import type { IntelligenceCapability } from './IntelligenceCapability.js';
import type { IntelligenceProviderProbeStatus } from './IntelligenceProviderProbeStatus.js';

// #endregion

/**
 * Provider-neutral result of a bounded provider availability probe.
 *
 * @public
 */
export interface IIntelligenceProviderProbeResult {
    // #region Properties

    readonly status: IntelligenceProviderProbeStatus;
    readonly provider: string;
    readonly model: string;
    readonly capability: IntelligenceCapability;
    readonly checkedAt: Date;
    readonly failureCode: string | null;

    // #endregion
}
