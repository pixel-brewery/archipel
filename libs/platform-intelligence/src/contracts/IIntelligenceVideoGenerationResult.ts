// #region Imports

import type { IIntelligenceGeneratedFile } from './IIntelligenceGeneratedFile.js';

// #endregion

/**
 * Provider-neutral video generation result.
 *
 * @public
 */
export interface IIntelligenceVideoGenerationResult {
    // #region Properties

    readonly videos: ReadonlyArray<IIntelligenceGeneratedFile>;
    readonly provider: string;
    readonly model: string;
    readonly warnings: ReadonlyArray<string>;

    // #endregion
}
