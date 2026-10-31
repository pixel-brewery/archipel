// #region Imports

import type { IIntelligenceUsage } from '../../contracts/IIntelligenceUsage.js';

// #endregion

/**
 * Normalized token usage reported by a realtime provider.
 *
 * Null values mean the provider did not expose that dimension. Applications
 * can therefore distinguish missing data from an actual zero-token count.
 *
 * @public
 */
export interface IIntelligenceRealtimeUsage extends IIntelligenceUsage {
    // #region Properties

    readonly rawUsage: unknown;

    // #endregion
}
