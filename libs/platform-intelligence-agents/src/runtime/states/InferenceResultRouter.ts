import type { IAgentInferenceResult } from '../../interfaces/IAgentInferenceResult.js';
import type { IAgentInferenceRequest } from '../../interfaces/IAgentInferenceRequest.js';
import type { AgentTransition } from '../../contracts/AgentTransition.js';
import { AgentRuntimeError } from '../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';

/**
 * Applies the same result validation and routing to buffered and streaming inference.
 *
 * @internal
 */
export class InferenceResultRouter {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Validates a normalized result and selects tool execution, final formatting or answer publication.
     *
     * @param result - Normalized result returned by a provider step.
     * @param request - Provider-neutral single-step inference request.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns The next typed transition selected from the provider result.
     * @throws {AgentRuntimeError} When the result has invalid tool identities or generation did not finish
     * successfully.
     */
    public route(result: IAgentInferenceResult, request: IAgentInferenceRequest, context: AgentLoopContext): AgentTransition {
        context.recordInference(result);
        context.rememberToolCalls(result.toolCalls);
        if (result.toolCalls.length > 0) {
            context.memory.append([
                {
                    role: 'assistant',
                    content: [
                        ...(result.text ? [{ type: 'text' as const, text: result.text }] : []),
                        ...result.toolCalls.map((call) => ({
                            type: 'tool-call' as const,
                            toolCallId: call.toolCallId,
                            toolName: call.toolName,
                            input: context.normalizeJson(call.input),
                        })),
                    ],
                },
            ]);
            return { nextStateId: 'function_call', input: { calls: result.toolCalls, index: 0, result } };
        }
        if (result.finishReason === 'length' || result.finishReason === 'error') {
            throw new AgentRuntimeError('INCOMPLETE_OUTPUT', 'Model output did not finish successfully.', context.id);
        }
        context.memory.append([{ role: 'assistant', content: result.text }]);
        if (context.options.schema && !request.schema) {
            return context.createInferenceTransition(true);
        }
        return { nextStateId: 'model_message', input: result };
    }
    // #endregion
}
