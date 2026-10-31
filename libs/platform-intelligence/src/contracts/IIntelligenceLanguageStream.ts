// #region Imports

import type { IIntelligenceUsage } from './IIntelligenceUsage.js';
import type { IntelligenceLanguageStreamPart } from './IntelligenceLanguageStreamPart.js';

// #endregion

/**
 * Provider-neutral text stream.
 *
 * @public
 */
export interface IIntelligenceLanguageStream {
    // #region Properties

    /** Consume either fullStream or textStream for a given response. */
    readonly fullStream?: AsyncIterable<IntelligenceLanguageStreamPart>;
    readonly textStream: AsyncIterable<string>;
    readonly text: PromiseLike<string>;
    readonly finishReason: PromiseLike<string>;
    readonly usage: PromiseLike<IIntelligenceUsage | null>;
    /**
     * Usage of each provider call in execution order once the stream finished; `usage` is their sum.
     *
     * A provider that prices every call on its own must be priced per entry rather than on the summed `usage`. Absent
     * when the underlying SDK stream carries no step details.
     */
    readonly stepUsage?: PromiseLike<ReadonlyArray<IIntelligenceUsage | null>>;

    // #endregion
}
