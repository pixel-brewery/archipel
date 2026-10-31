import type { IAgentInferenceRequest } from '../interfaces/IAgentInferenceRequest.js';
import type { IAgentInferenceResult } from '../interfaces/IAgentInferenceResult.js';
import type { AgentInferenceEvent } from '../contracts/AgentInferenceEvent.js';

/**
 * Defines a replaceable boundary for one buffered or streaming model step.
 *
 * @remarks
 * Adapters must honor abortSignal, preserve tool-call identities and wrap provider errors. The default adapter reuses
 * the lower intelligence layer's provider resilience; custom adapters own their retry and circuit-breaker policy.
 * @public
 */
export abstract class AgentInferenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Generates exactly one provider response without executing tool effects.
     *
     * @param request - Instructions, messages, tool declarations and provider controls for this step.
     * @returns One normalized model response with tool calls and usage evidence.
     * @throws {AgentRuntimeError} When the configured adapter cannot complete the provider step.
     */
    public abstract run(request: IAgentInferenceRequest): Promise<IAgentInferenceResult>;

    /**
     * Streams one provider step, ending with exactly one normalized output event.
     *
     * @param request - Instructions, messages, tool declarations and provider controls for this step.
     * @returns Incremental events followed by the normalized final response.
     * @throws {AgentRuntimeError} When the configured adapter cannot complete the provider stream.
     */
    public abstract stream(request: IAgentInferenceRequest): AsyncIterable<AgentInferenceEvent>;

    // #endregion
}
