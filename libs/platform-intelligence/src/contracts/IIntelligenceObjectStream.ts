// #region Imports

import type { IIntelligenceUsage } from './IIntelligenceUsage.js';

// #endregion

/**
 * Provider-neutral structured-output stream.
 *
 * @public
 */
export interface IIntelligenceObjectStream<T> {
    // #region Properties

    readonly partialOutputStream: AsyncIterable<Partial<T>>;
    readonly output: PromiseLike<T>;
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
