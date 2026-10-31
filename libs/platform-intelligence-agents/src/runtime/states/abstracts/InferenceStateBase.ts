import type { AgentTransition } from '../../../contracts/AgentTransition.js';
import type { IAgentInferenceRequest } from '../../../interfaces/IAgentInferenceRequest.js';
import type { IAgentInferenceResult } from '../../../interfaces/IAgentInferenceResult.js';
import { AgentRuntimeError } from '../../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../../AgentLoopContext.js';
import { LoopStateBase } from './LoopStateBase.js';
import { InferenceResultRouter } from '../InferenceResultRouter.js';

/**
 * Uses a Template Method so both inference states share validation and transition routing.
 *
 * @internal
 */
export abstract class InferenceStateBase extends LoopStateBase {
    // #region Fields

    private readonly _router: InferenceResultRouter = new InferenceResultRouter();

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Applies the shared inference lifecycle and routes the normalized provider result.
     *
     * @param transition - Typed next step selected by the loop or interception policy.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns Tool execution, final formatting or answer publication selected from the provider result.
     */
    public override async run(transition: AgentTransition, context: AgentLoopContext): Promise<AgentTransition> {
        if ((transition.nextStateId !== 'inference' && transition.nextStateId !== 'inference_streaming') || transition.nextStateId !== this.id) {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'Inference received another state input.', context.id);
        }
        const request: IAgentInferenceRequest = { ...transition.input, options: { ...transition.input.options, abortSignal: context.signal } };
        context.emit('inference.started', {});
        const result: IAgentInferenceResult = await this.infer(request, context);
        return this._router.route(result, request, context);
    }

    /**
     * Obtains one normalized result using the state's buffered or streaming strategy.
     *
     * @param request - Provider-neutral request prepared by the shared inference lifecycle.
     * @param context - Isolated conversation, cancellation signal and inference adapter for this loop.
     * @returns One normalized result for the shared result router.
     */
    protected abstract infer(request: IAgentInferenceRequest, context: AgentLoopContext): Promise<IAgentInferenceResult>;

    // #endregion
}
