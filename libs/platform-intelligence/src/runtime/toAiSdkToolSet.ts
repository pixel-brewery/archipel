// #region Imports

import type { ModelMessage, ToolSet } from 'ai';
import type { IIntelligenceModelMessage } from '../contracts/IIntelligenceModelMessage.js';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';
import { toAiSdkSchema } from './toAiSdkSchema.js';
import { toAiSdkProviderOptions } from './toAiSdkProviderOptions.js';

// #endregion

/**
 * Converts application tools into native AI SDK tools inside Archipel.
 *
 * @internal
 */
export async function toAiSdkToolSet(tools: Readonly<Record<string, IIntelligenceTool['tool']>>): Promise<ToolSet> {
    const { tool } = await import('ai');
    const result: ToolSet = {};

    for (const [name, definition] of Object.entries(tools)) {
        if ('nativeDefinition' in definition) {
            result[name] = definition.nativeDefinition as ToolSet[string];
            continue;
        }

        const inputSchema = await toAiSdkSchema(definition.inputSchema);
        const outputSchema = definition.outputSchema ? await toAiSdkSchema(definition.outputSchema) : undefined;

        result[name] = tool({
            description: definition.description,
            inputSchema,
            outputSchema,
            providerOptions: toAiSdkProviderOptions(definition.providerOptions),
            needsApproval: definition.needsApproval,
            execute: definition.execute
                ? async (
                      input: unknown,
                      options: {
                          readonly toolCallId: string;
                          readonly messages: Array<ModelMessage>;
                          readonly abortSignal?: AbortSignal;
                      },
                  ): Promise<unknown> =>
                      definition.execute?.(input, {
                          toolCallId: options.toolCallId,
                          messages: options.messages as Array<IIntelligenceModelMessage>,
                          abortSignal: options.abortSignal,
                      })
                : undefined,
        } as never) as ToolSet[string];
    }

    return result;
}
