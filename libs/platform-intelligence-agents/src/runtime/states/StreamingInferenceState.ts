import type { IAgentInferenceRequest } from '../../interfaces/IAgentInferenceRequest.js';
import { Logger } from '@nestjs/common';
import type { IAgentInferenceResult } from '../../interfaces/IAgentInferenceResult.js';
import { AgentRuntimeError } from '../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';
import { withAgentAbort } from '../withAgentAbort.js';
import { InferenceStateBase } from './abstracts/InferenceStateBase.js';

/**
 * Collects one final inference result while forwarding incremental provider events.
 *
 * @internal
 */
export class StreamingInferenceState extends InferenceStateBase {
    // #region Fields
    /**
     * Execution-phase discriminator handled by this state.
     */
    public override readonly id = 'inference_streaming' as const;
    private readonly _logger: Logger = new Logger(StreamingInferenceState.name);
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Forwards incremental events and requires exactly one final inference result.
     *
     * @param request - Provider-neutral single-step inference request.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns One normalized inference result suitable for the shared result router.
     */
    protected override async infer(request: IAgentInferenceRequest, context: AgentLoopContext): Promise<IAgentInferenceResult> {
        const startedAt = Date.now();
        let result: IAgentInferenceResult | undefined;
        const iterator = context.inference.stream(request)[Symbol.asyncIterator]();
        try {
            while (true) {
                const next = await withAgentAbort(iterator.next(), context.signal, context.id);
                if (next.done) {
                    break;
                }
                if (next.value.type === 'output') {
                    if (result) {
                        throw new AgentRuntimeError('INVALID_STREAM', 'Stream produced multiple final outputs.', context.id);
                    }
                    result = next.value.result;
                } else {
                    if (next.value.type === 'error') {
                        throw new AgentRuntimeError('INFERENCE_FAILED', 'Agent stream failed.', context.id);
                    }
                    context.emit('inference.stream', next.value);
                }
            }
        } finally {
            if (iterator.return) {
                void Promise.resolve()
                    .then(() => iterator.return?.())
                    .catch((_error: unknown) => this.reportCleanupFailure(context, startedAt));
            }
        }
        if (!result) {
            throw new AgentRuntimeError('INVALID_STREAM', 'Stream did not produce a final output.', context.id);
        }
        return result;
    }
    private reportCleanupFailure(context: AgentLoopContext, startedAt: number): void {
        this._logger.warn({
            module: 'platform-intelligence-agents',
            operation: 'closeStream',
            requestId: context.id,
            duration: Date.now() - startedAt,
            code: 'STREAM_CLEANUP_FAILED',
        });
        try {
            context.emit('stream.cleanup_failed', {});
        } catch (_error: unknown) {
            this._logger.warn({
                module: 'platform-intelligence-agents',
                operation: 'closeStream',
                requestId: context.id,
                duration: Date.now() - startedAt,
                code: 'EVENT_DISPATCH_FAILED',
            });
        }
    }
    // #endregion
}
