import type { AgentTransition } from '../../contracts/AgentTransition.js';
import { AgentRuntimeError } from '../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';
import { LoopStateBase } from './abstracts/LoopStateBase.js';

/**
 * Publishes the completed answer and moves the loop to its terminal phase.
 *
 * @internal
 */
export class ModelMessageState extends LoopStateBase {
    // #region Fields
    /**
     * Execution-phase discriminator handled by this state.
     */
    public override readonly id = 'model_message' as const;
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Publishes the completed model answer and selects the terminal phase.
     *
     * @param transition - Typed next step selected by the loop or interception policy.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns The terminal idle transition after publishing the answer.
     */
    public override async run(transition: AgentTransition, context: AgentLoopContext): Promise<AgentTransition> {
        if (transition.nextStateId !== this.id) {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'Answer publication received another state input.', context.id);
        }
        context.emit('model.answer', { answer: transition.input.text, output: transition.input.output });
        return { nextStateId: 'idle', input: undefined };
    }
    // #endregion
}
