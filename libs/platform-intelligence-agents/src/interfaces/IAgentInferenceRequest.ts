import type { IIntelligenceLanguageGenerationOptions, IIntelligencePrompt, IIntelligenceSchema } from '@pixel-brewery/archipel-platform-intelligence';

/**
 * One provider step. Tools are declarations only; execution belongs to the agent loop.
 *
 * @public
 */
export interface IAgentInferenceRequest {
    /**
     * Provider-neutral instructions and conversation for one inference step.
     */
    readonly prompt: IIntelligencePrompt;
    /**
     * Single-step provider options, including tool declarations and the active abort signal.
     */
    readonly options: IIntelligenceLanguageGenerationOptions;
    /**
     * Optional schema for the final structured result.
     */
    readonly schema?: IIntelligenceSchema<unknown>;
}
