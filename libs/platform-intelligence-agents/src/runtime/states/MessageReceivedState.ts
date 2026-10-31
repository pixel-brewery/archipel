import type { AgentTransition } from '../../contracts/AgentTransition.js';
import { AgentRuntimeError } from '../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';
import { LoopStateBase } from './abstracts/LoopStateBase.js';

/**
 * Adds the triggering message to the run's isolated conversation.
 *
 * @internal
 */
export class MessageReceivedState extends LoopStateBase {
    // #region Fields
    /**
     * Execution-phase discriminator handled by this state.
     */
    public override readonly id = 'message_received' as const;
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Records the triggering message and selects the initial inference phase.
     *
     * @param transition - Typed next step selected by the loop or interception policy.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns The first buffered or streaming inference request.
     */
    public override async run(transition: AgentTransition, context: AgentLoopContext): Promise<AgentTransition> {
        if (transition.nextStateId !== this.id) {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'Message reception received another state input.', context.id);
        }
        context.emit('message_received.started', { content: transition.input.content });
        context.memory.append([{ role: 'user', content: transition.input.content }]);
        context.emit('message_received.completed', {});
        return context.createInferenceTransition();
    }
    // #endregion
}
