import type { IMcpPromptMetadata } from './IMcpPromptMetadata.js';

/**
 * Entry for a registered prompt handler.
 */
export interface IRegisteredPrompt {
    /** Prompt metadata supplied by the decorator or explicit registration. */
    readonly metadata: IMcpPromptMetadata;
    /** Bound application handler invoked with the protocol's prompt arguments. */
    readonly handler: (...args: unknown[]) => unknown;
}
