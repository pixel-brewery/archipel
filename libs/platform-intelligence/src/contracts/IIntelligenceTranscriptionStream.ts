// #region Imports

import type { IntelligenceTranscriptionStreamPart } from './IntelligenceTranscriptionStreamPart.js';

// #endregion

/**
 * Provider-neutral live transcription result.
 *
 * The full stream has one consumer. Access it before any final-result promise
 * when both incremental and final output are required.
 *
 * @public
 */
export interface IIntelligenceTranscriptionStream {
    // #region Properties

    readonly provider: string;
    readonly model: string;
    readonly fullStream: AsyncIterable<IntelligenceTranscriptionStreamPart>;
    readonly text: PromiseLike<string>;
    readonly segments: PromiseLike<
        ReadonlyArray<{
            readonly text: string;
            readonly startSecond: number;
            readonly endSecond: number;
        }>
    >;
    readonly language: PromiseLike<string | undefined>;
    readonly durationInSeconds: PromiseLike<number | undefined>;
    readonly warnings: PromiseLike<ReadonlyArray<string>>;

    // #endregion
}
