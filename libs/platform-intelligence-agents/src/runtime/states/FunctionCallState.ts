import type { AgentTransition } from '../../contracts/AgentTransition.js';
import { AgentRuntimeError } from '../../errors/AgentRuntimeError.js';
import type { AgentLoopContext } from '../AgentLoopContext.js';
import { AgentToolExecutor } from '../AgentToolExecutor.js';
import { LoopStateBase } from './abstracts/LoopStateBase.js';

/**
 * Executes one ordered tool call and records its correlated result before continuing.
 *
 * @internal
 */
export class FunctionCallState extends LoopStateBase {
    // #region Fields
    /**
     * Execution-phase discriminator handled by this state.
     */
    public override readonly id = 'function_call' as const;
    private readonly _executor: AgentToolExecutor = new AgentToolExecutor();
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Executes the selected tool and appends its correlated result before advancing the batch.
     *
     * @param transition - Typed next step selected by the loop or interception policy.
     * @param context - Isolated conversation, policies and active cancellation signal for this loop.
     * @returns The next tool call in the response batch, or a new inference request after the batch.
     */
    public override async run(transition: AgentTransition, context: AgentLoopContext): Promise<AgentTransition> {
        if (transition.nextStateId !== this.id) {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'Tool execution received another state input.', context.id);
        }
        const call = transition.input.calls[transition.input.index];
        if (!call) {
            throw new AgentRuntimeError('INVALID_TRANSITION', 'Pending tool call is absent.', context.id);
        }
        context.emit('function_call.started', { call });
        const output = await this._executor.execute(call, context);
        context.memory.append([{ role: 'tool', content: [{ type: 'tool-result', toolCallId: call.toolCallId, toolName: call.toolName, output }] }]);
        context.emit('function_call.completed', { call, output });
        const index = transition.input.index + 1;
        return index < transition.input.calls.length
            ? { nextStateId: 'function_call', input: { ...transition.input, index } }
            : context.createInferenceTransition();
    }
    // #endregion
}
