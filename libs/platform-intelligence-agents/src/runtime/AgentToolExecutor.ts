import { validateIntelligenceSchema } from '@pixel-brewery/archipel-platform-intelligence';
import { Logger } from '@nestjs/common';
import type { IIntelligenceToolCall, IntelligenceJsonValue } from '@pixel-brewery/archipel-platform-intelligence';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from './AgentLoopContext.js';
import { withAgentAbort } from './withAgentAbort.js';

/**
 * Applies approval, schema validation and authoritative permission guards before a tool effect.
 *
 * @internal
 */
export class AgentToolExecutor {
    // #region Fields
    private readonly _logger: Logger = new Logger(AgentToolExecutor.name);
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Validates tool data and applies application approval and permission guards before one effect.
     *
     * @param call - Model-selected tool call whose approval, validation and guards must precede the effect.
     * @param context - Isolated execution or situation context for this operation.
     * @returns Validated JSON output, or a sanitized error result that the model can use to correct its request.
     * @throws {AgentRuntimeError} When approval, an authoritative guard or cancellation prevents the tool effect.
     */
    public async execute(call: IIntelligenceToolCall, context: AgentLoopContext): Promise<IntelligenceJsonValue> {
        const startedAt = Date.now();
        context.assertActive();
        const tool = Object.hasOwn(context.agent.tools, call.toolName) ? context.agent.tools[call.toolName] : undefined;
        if (!tool?.execute) {
            return { error: 'UNKNOWN_TOOL', message: 'Requested tool is unavailable.' };
        }
        if (
            tool.needsApproval &&
            !(await withAgentAbort(
                Promise.resolve().then(() => context.options.approveToolCall?.(call, { loopId: context.id, abortSignal: context.signal }) ?? false),
                context.signal,
                context.id,
            ))
        ) {
            throw new AgentRuntimeError('TOOL_APPROVAL_REQUIRED', 'Tool execution requires application approval.', context.id);
        }
        let input: unknown;
        try {
            input = await withAgentAbort(validateIntelligenceSchema(tool.inputSchema, call.input, 'Agent tool input'), context.signal, context.id);
        } catch (error: unknown) {
            if (context.signal.aborted) {
                throw error;
            }
            this.reportFailure('INVALID_TOOL_INPUT', context.id, startedAt);
            context.emit('function_call.rejected', { code: 'INVALID_TOOL_INPUT', toolName: call.toolName });
            return { error: 'INVALID_TOOL_INPUT', message: 'Tool arguments did not satisfy the schema.' };
        }
        if (context.options.beforeToolCall) {
            await withAgentAbort(
                Promise.resolve().then(() => context.options.beforeToolCall?.(call, { loopId: context.id, abortSignal: context.signal })),
                context.signal,
                context.id,
            );
        }
        context.assertActive();
        try {
            const result = await withAgentAbort(
                Promise.resolve().then(() =>
                    tool.execute?.(input, { toolCallId: call.toolCallId, messages: context.memory.getMessages(), abortSignal: context.signal }),
                ),
                context.signal,
                context.id,
            );
            const validated = tool.outputSchema
                ? await withAgentAbort(validateIntelligenceSchema(tool.outputSchema, result, 'Agent tool output', 'output'), context.signal, context.id)
                : result;
            return context.normalizeJson(validated);
        } catch (error: unknown) {
            if (context.signal.aborted) {
                throw error;
            }
            this.reportFailure('TOOL_FAILED', context.id, startedAt);
            context.emit('function_call.failed', { code: 'TOOL_FAILED', toolName: call.toolName });
            return { error: 'TOOL_FAILED', message: 'Tool execution failed.' };
        }
    }
    private reportFailure(code: string, requestId: string, startedAt: number): void {
        this._logger.warn({ module: 'platform-intelligence-agents', operation: 'executeTool', requestId, duration: Date.now() - startedAt, code });
    }
    // #endregion
}
