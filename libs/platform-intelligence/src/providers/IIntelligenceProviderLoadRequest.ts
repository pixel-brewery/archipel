// #region Imports

import type { IIntelligenceProviderConfiguration } from '../contracts/IIntelligenceProviderConfiguration.js';
import type { IntelligenceCapability } from '../contracts/IntelligenceCapability.js';

// #endregion

/**
 * Internal model/API load request passed to a provider adapter.
 *
 * @public
 */
export interface IIntelligenceProviderLoadRequest {
    // #region Properties

    readonly capability: IntelligenceCapability;
    readonly configuration: IIntelligenceProviderConfiguration;
    /** Total timeout for the complete capability operation, including retries and polling. */
    readonly operationTimeoutMs: number;

    /** Timeout for one outbound provider request. */
    readonly providerRequestTimeoutMs: number;

    // #endregion
}
