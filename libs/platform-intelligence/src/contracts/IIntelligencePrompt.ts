// #region Imports

import type { IIntelligenceModelMessage } from './IIntelligenceModelMessage.js';

// #endregion

/**
 * Provider-neutral language-model prompt.
 *
 * @public
 */
export interface IIntelligencePrompt {
    // #region Properties

    readonly instructions?: string;
    readonly system?: string;
    readonly prompt?: string;
    readonly messages?: ReadonlyArray<IIntelligenceModelMessage>;

    // #endregion
}
