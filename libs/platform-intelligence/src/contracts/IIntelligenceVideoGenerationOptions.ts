// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral video generation options.
 *
 * @public
 */
export interface IIntelligenceVideoGenerationOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly prompt:
        | string
        | {
              readonly image: string | Uint8Array | ArrayBuffer;
              readonly text?: string;
          };
    readonly maxRetries?: number;
    readonly count?: number;
    readonly maxVideosPerCall?: number;
    readonly aspectRatio?: `${number}:${number}`;
    readonly resolution?: `${number}x${number}`;
    readonly durationSeconds?: number;
    readonly framesPerSecond?: number;
    readonly seed?: number;
    readonly generateAudio?: boolean;
    readonly frameImages?: ReadonlyArray<{
        readonly image: string | Uint8Array | ArrayBuffer;
        readonly frameType: 'first_frame' | 'last_frame';
    }>;
    readonly inputReferences?: ReadonlyArray<
        | string
        | Uint8Array
        | ArrayBuffer
        | {
              readonly data: string | Uint8Array | ArrayBuffer;
              readonly mediaType?: string;
          }
    >;

    // #endregion
}
