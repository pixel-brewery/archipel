import type { IIntelligenceToolCall, IIntelligenceUsage } from '@pixel-brewery/archipel-platform-intelligence';

/**
 * Normalized provider output shared by buffered and streaming loops.
 *
 * @public
 */
export interface IAgentInferenceResult {
    /**
     * Normalized model text for the completed provider step.
     */
    readonly text: string;
    /**
     * Normalized final output, including a schema-constrained object when requested.
     */
    readonly output?: unknown;
    /**
     * Reasoning text exposed by the configured provider, when available.
     */
    readonly reasoningText?: string;
    /**
     * Tool calls selected by the model, retained in response order.
     */
    readonly toolCalls: ReadonlyArray<IIntelligenceToolCall>;
    /**
     * Normalized usage for this provider step; null means no usage was reported.
     */
    readonly usage: IIntelligenceUsage | null;
    /**
     * Usage entries reported by the lower intelligence infrastructure, in call order.
     */
    readonly stepUsage?: ReadonlyArray<IIntelligenceUsage | null>;
    /**
     * Normalized provider reason for ending generation.
     */
    readonly finishReason: string;
}
