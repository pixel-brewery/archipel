import type { IIntelligenceLanguageGenerationOptions, IIntelligenceSchema, IIntelligenceToolCall } from '@pixel-brewery/archipel-platform-intelligence';
import type { AgentInterceptionBase } from '../abstracts/AgentInterceptionBase.js';

/**
 * Bounded per-run controls. Model/provider policy remains in platform-intelligence.
 *
 * @public
 */
export interface IAgentRunOptions {
    /**
     * Single-step provider controls; tool ownership remains with the agent loop.
     */
    readonly generation?: Omit<
        IIntelligenceLanguageGenerationOptions,
        'tools' | 'maxSteps' | 'includeRegisteredTools' | 'deferredToolLoading' | 'activeToolNames' | 'onToolExecutionStart' | 'onToolExecutionEnd'
    >;
    /**
     * Optional schema for the final structured result.
     */
    readonly schema?: IIntelligenceSchema<unknown>;
    /**
     * Whether provider output is delivered incrementally during the run.
     */
    readonly streaming?: boolean;
    /**
     * Application policy evaluated before a matching loop phase executes.
     */
    readonly interception?: AgentInterceptionBase;
    /**
     * Maximum state executions across the run and all resumes; defaults to 64, with a supported range of 1–4096.
     */
    readonly maxTransitions?: number;
    /**
     * Timeout for each active run/resume invocation in milliseconds; defaults to 30000, with a range of 1–3600000.
     */
    readonly timeoutMs?: number;
    /**
     * Required for tools declaring needsApproval. Called before every tool effect, never inferred by the model.
     */
    readonly approveToolCall?: (
        call: IIntelligenceToolCall,
        context: {
            /**
             * Correlation identifier of the originating agent loop, when applicable.
             */
            readonly loopId: string;
            /**
             * Cancellation signal that adapters and effects must honor.
             */
            readonly abortSignal: AbortSignal;
        },
    ) => boolean | Promise<boolean>;
    /**
     * Authoritative application guard before every tool effect, including after a paused run resumes.
     */
    readonly beforeToolCall?: (
        call: IIntelligenceToolCall,
        context: {
            /**
             * Correlation identifier of the originating agent loop, when applicable.
             */
            readonly loopId: string;
            /**
             * Cancellation signal that adapters and effects must honor.
             */
            readonly abortSignal: AbortSignal;
        },
    ) => void | Promise<void>;
}
