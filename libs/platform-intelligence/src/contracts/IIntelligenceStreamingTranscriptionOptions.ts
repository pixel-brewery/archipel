// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral live transcription options.
 *
 * @public
 */
export interface IIntelligenceStreamingTranscriptionOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly audio: ReadableStream<Uint8Array | string>;
    readonly inputAudioFormat: {
        readonly type: string;
        readonly rate?: number;
    };
    readonly includeRawChunks?: boolean;

    // #endregion
}
