import type { IIntelligenceModelMessage } from '@pixel-brewery/archipel-platform-intelligence';

/**
 * Application-persistable memory record; does not contain executable tools.
 *
 * @public
 */
export interface IModelContextRecord {
    /**
     * Conversation identity preserved during persistence and restoration.
     */
    readonly id: string;
    /**
     * Provider-neutral conversation messages without executable tool definitions.
     */
    readonly messages: ReadonlyArray<IIntelligenceModelMessage>;
}
