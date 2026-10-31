// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral transcription options.
 *
 * @public
 */
export interface IIntelligenceTranscriptionOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly audio: string | URL | Uint8Array | ArrayBuffer;
    readonly maxRetries?: number;

    // #endregion
}
