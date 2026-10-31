// #region Imports

import type { IIntelligenceGeneratedFile } from './IIntelligenceGeneratedFile.js';
import type { IIntelligenceToolCall } from './IIntelligenceToolCall.js';
import type { IIntelligenceUsage } from './IIntelligenceUsage.js';

// #endregion

/**
 * Normalized language generation result.
 *
 * @public
 */
export interface IIntelligenceLanguageCompletion<TOutput = string> {
    // #region Properties

    readonly text: string;
    readonly output: TOutput;
    readonly provider: string;
    readonly model: string;
    readonly finishReason: string;
    readonly reasoningText?: string;
    readonly sources: ReadonlyArray<{
        readonly type: string;
        readonly id?: string;
        readonly url?: string;
        readonly title?: string;
    }>;
    readonly files: ReadonlyArray<IIntelligenceGeneratedFile>;
    readonly toolCalls: ReadonlyArray<IIntelligenceToolCall>;
    readonly toolResults: ReadonlyArray<unknown>;
    readonly warnings: ReadonlyArray<string>;
    readonly usage: IIntelligenceUsage | null;
    /**
     * Usage of each provider call in execution order; `usage` is their sum.
     *
     * A tool loop calls the provider once per step. A provider that prices every call on its own, for example with a
     * surcharge above an input-token threshold, must be priced per entry rather than on the summed `usage`. Absent when
     * the underlying SDK result carries no step details.
     */
    readonly stepUsage?: ReadonlyArray<IIntelligenceUsage | null>;

    // #endregion
}
