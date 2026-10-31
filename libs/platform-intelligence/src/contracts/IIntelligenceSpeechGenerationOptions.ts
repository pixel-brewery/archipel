// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral speech generation options.
 *
 * @public
 */
export interface IIntelligenceSpeechGenerationOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly text: string;
    readonly maxRetries?: number;
    readonly voice?: string;
    readonly outputFormat?: string;
    readonly instructions?: string;
    readonly speed?: number;
    readonly language?: string;

    // #endregion
}
