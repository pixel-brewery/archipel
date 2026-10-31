// #region Imports

import type { IIntelligenceModelRequestOptions } from './IIntelligenceModelRequestOptions.js';

// #endregion

/**
 * Provider-neutral file upload options.
 *
 * @public
 */
export interface IIntelligenceFileUploadOptions extends IIntelligenceModelRequestOptions {
    // #region Properties

    readonly data: Uint8Array | string | { readonly type: 'data'; readonly data: Uint8Array | string } | { readonly type: 'text'; readonly text: string };
    readonly mediaType?: string;
    readonly filename?: string;

    // #endregion
}
