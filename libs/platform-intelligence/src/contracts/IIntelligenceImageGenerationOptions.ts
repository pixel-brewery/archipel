// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral image generation options.
 *
 * @public
 */
export interface IIntelligenceImageGenerationOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly prompt:
        | string
        | {
              readonly images: ReadonlyArray<string | Uint8Array | ArrayBuffer>;
              readonly text?: string;
              readonly mask?: string | Uint8Array | ArrayBuffer;
          };
    readonly maxRetries?: number;
    readonly count?: number;
    readonly maxImagesPerCall?: number;
    readonly size?: `${number}x${number}`;
    readonly aspectRatio?: `${number}:${number}`;
    readonly seed?: number;

    // #endregion
}
