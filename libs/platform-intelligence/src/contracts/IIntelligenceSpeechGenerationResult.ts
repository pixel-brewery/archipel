// #region Imports

import type { IIntelligenceGeneratedFile } from './IIntelligenceGeneratedFile.js';

// #endregion

/**
 * Provider-neutral speech generation result.
 *
 * @public
 */
export interface IIntelligenceSpeechGenerationResult {
    // #region Properties

    readonly audio: IIntelligenceGeneratedFile;
    readonly provider: string;
    readonly model: string;
    readonly warnings: ReadonlyArray<string>;

    // #endregion
}
