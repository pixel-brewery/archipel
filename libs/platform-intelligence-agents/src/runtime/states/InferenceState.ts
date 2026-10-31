import type { IAgentInferenceRequest } from '../../interfaces/IAgentInferenceRequest.js';
import type { IAgentInferenceResult } from '../../interfaces/IAgentInferenceResult.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';
import { withAgentAbort } from '../withAgentAbort.js';
import { InferenceStateBase } from './abstracts/InferenceStateBase.js';

/**
 * Executes one buffered provider step within the run's cancellation budget.
 *
 * @internal
 */
export class InferenceState extends InferenceStateBase {
    // #region Fields
    /**
     * Execution-phase discriminator handled by this state.
     */
    public override readonly id = 'inference' as const;
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Obtains one buffered provider result under the active cancellation signal.
     *
     * @param request - Provider-neutral single-step inference request.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns One normalized inference result suitable for the shared result router.
     */
    protected override infer(request: IAgentInferenceRequest, context: AgentLoopContext): Promise<IAgentInferenceResult> {
        return withAgentAbort(context.inference.run(request), context.signal, context.id);
    }
    // #endregion
}
