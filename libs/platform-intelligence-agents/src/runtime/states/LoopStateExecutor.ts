import type { AgentTransition } from '../../contracts/AgentTransition.js';
import type { AgentLoopState } from '../../contracts/AgentLoopState.js';
import { AgentRuntimeError } from '../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';
import { LoopStateBase } from './abstracts/LoopStateBase.js';
import { MessageReceivedState } from './MessageReceivedState.js';
import { InferenceState } from './InferenceState.js';
import { StreamingInferenceState } from './StreamingInferenceState.js';
import { FunctionCallState } from './FunctionCallState.js';
import { ModelMessageState } from './ModelMessageState.js';

/**
 * Dispatches each transition to its State object without coupling loop control to state behavior.
 *
 * @internal
 */
export class LoopStateExecutor {
    // #region Fields
    private readonly _states: ReadonlyMap<Exclude<AgentLoopState, 'idle'>, LoopStateBase>;
    // #endregion

    // #region Ctor
    /**
     * Composes the executable loop states without exposing state behavior to the coordinator.
     */
    public constructor() {
        const states: ReadonlyArray<LoopStateBase> = [
            new MessageReceivedState(),
            new InferenceState(),
            new StreamingInferenceState(),
            new FunctionCallState(),
            new ModelMessageState(),
        ];
        this._states = new Map(states.map((state) => [state.id, state]));
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Dispatches a transition to its registered State object.
     *
     * @param transition - Typed next step selected by the loop or interception policy.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns The next typed transition selected by the state that handled the input.
     * @throws {AgentRuntimeError} When a terminal or unknown phase is selected for execution.
     */
    public execute(transition: AgentTransition, context: AgentLoopContext): Promise<AgentTransition> {
        if (transition.nextStateId === 'idle') {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'A terminal phase cannot be executed.', context.id);
        }
        const state = this._states.get(transition.nextStateId);
        if (!state) {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'No state is registered for the transition.', context.id);
        }
        return state.run(transition, context);
    }
    // #endregion
}
