// #region Imports

import type { IIntelligenceModelMessage } from './IIntelligenceModelMessage.js';
import type { IIntelligenceSchema } from './IIntelligenceSchema.js';
import type { IntelligenceProviderOptions } from './IntelligenceProviderOptions.js';

// #endregion

/**
 * Provider-neutral application tool definition.
 *
 * @public
 */
export interface IIntelligenceToolDefinition<TInput = unknown, TOutput = unknown> {
    // #region Properties

    readonly description?: string;
    readonly inputSchema: IIntelligenceSchema<TInput>;
    readonly outputSchema?: IIntelligenceSchema<TOutput>;
    readonly providerOptions?: IntelligenceProviderOptions;
    readonly needsApproval?: boolean;

    // #endregion

    // #region Methods

    execute?(
        input: TInput,
        context: {
            readonly toolCallId: string;
            readonly messages: ReadonlyArray<IIntelligenceModelMessage>;
            readonly abortSignal?: AbortSignal;
        },
    ): TOutput | Promise<TOutput>;

    // #endregion
}
