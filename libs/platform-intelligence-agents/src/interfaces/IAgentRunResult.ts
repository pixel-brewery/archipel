import type { AgentLoopState } from '../contracts/AgentLoopState.js';
import type { IAgentInferenceResult } from './IAgentInferenceResult.js';
import type { IModelContextRecord } from './IModelContextRecord.js';

/**
 * Observable outcome. Paused loops are process-local and must be resumed or cancelled explicitly.
 *
 * @public
 */
export interface IAgentRunResult {
    /**
     * Correlation identifier retained across this run and its resumed invocations.
     */
    readonly loopId: string;
    /**
     * Identifier of the AI participant responsible for the run.
     */
    readonly agentId: string;
    /**
     * Terminal or paused outcome of the run.
     */
    readonly status: 'completed' | 'paused' | 'stopped';
    /**
     * Optional explanation supplied by the interception policy when it stops the run.
     */
    readonly reason?: string;
    /**
     * Latest provider response, or undefined when execution stops or pauses before inference.
     */
    readonly result?: IAgentInferenceResult;
    /**
     * Defensive snapshot of this run's isolated conversation, including messages already processed before a pause.
     */
    readonly context: IModelContextRecord;
    /**
     * Snapshot of visited execution phases in execution order.
     */
    readonly transitions: ReadonlyArray<AgentLoopState>;
}
