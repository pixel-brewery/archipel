import type { AgentTransition } from '../../../contracts/AgentTransition.js';
import type { AgentLoopState } from '../../../contracts/AgentLoopState.js';
import type { AgentLoopContext } from '../../AgentLoopContext.js';

/**
 * Defines the State pattern boundary for a single executable loop phase.
 *
 * @internal
 */
export abstract class LoopStateBase {
    // #region Fields

    /**
     * Execution-phase discriminator handled by this state.
     */
    public abstract readonly id: Exclude<AgentLoopState, 'idle'>;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Executes the state-specific behavior for a matching typed transition.
     *
     * @param transition - Typed next step selected by the loop or interception policy.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns The next typed transition selected by this state.
     */
    public abstract run(transition: AgentTransition, context: AgentLoopContext): Promise<AgentTransition>;

    // #endregion
}
