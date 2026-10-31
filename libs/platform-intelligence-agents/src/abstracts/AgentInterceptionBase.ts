import type { AgentTransition } from '../contracts/AgentTransition.js';
import type { AgentInterceptionResult } from '../contracts/AgentInterceptionResult.js';

/**
 * Defines the application policy boundary before a selected loop state executes.
 *
 * @public
 */
export abstract class AgentInterceptionBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Selects transitions that require application policy inspection.
     *
     * @param transition - Next typed step proposed by the loop.
     * @returns True when handle must evaluate this transition.
     */
    public abstract isSatisfiedBy(transition: AgentTransition): boolean;

    /**
     * Approves, rewrites, pauses or stops the selected transition before execution.
     *
     * @remarks
     * Implementations must honor the supplied cancellation signal and resolve current application permissions.
     * @param transition - Next typed step selected for policy inspection.
     * @param context - Loop identity, agent identity and cancellation signal for this invocation.
     * @returns The continuation, pause or stop decision for this transition.
     */
    public abstract handle(
        transition: AgentTransition,
        context: {
            /**
             * Correlation identifier of the originating agent loop, when applicable.
             */
            readonly loopId: string;
            /**
             * Identifier of the AI participant responsible for the run.
             */
            readonly agentId: string;
            /**
             * Cancellation signal that adapters and effects must honor.
             */
            readonly abortSignal: AbortSignal;
        },
    ): Promise<AgentInterceptionResult>;

    // #endregion
}
