// #region Imports

import type { IIntelligenceModelRequestOptions } from './IIntelligenceModelRequestOptions.js';

// #endregion

/**
 * Provider-neutral skill bundle upload options.
 *
 * @public
 */
export interface IIntelligenceSkillUploadOptions extends IIntelligenceModelRequestOptions {
    // #region Properties

    readonly files: ReadonlyArray<{
        readonly path: string;
        readonly data: Uint8Array | string | { readonly type: 'data'; readonly data: Uint8Array | string } | { readonly type: 'text'; readonly text: string };
    }>;
    readonly displayTitle?: string;

    // #endregion
}
