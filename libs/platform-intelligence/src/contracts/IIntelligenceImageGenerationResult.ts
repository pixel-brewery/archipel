// #region Imports

import type { IIntelligenceGeneratedFile } from './IIntelligenceGeneratedFile.js';
import type { IIntelligenceUsage } from './IIntelligenceUsage.js';

// #endregion

/**
 * Provider-neutral image generation result.
 *
 * @public
 */
export interface IIntelligenceImageGenerationResult {
    // #region Properties

    readonly images: ReadonlyArray<IIntelligenceGeneratedFile>;
    readonly provider: string;
    readonly model: string;
    readonly warnings: ReadonlyArray<string>;
    readonly usage: IIntelligenceUsage | null;

    // #endregion
}
