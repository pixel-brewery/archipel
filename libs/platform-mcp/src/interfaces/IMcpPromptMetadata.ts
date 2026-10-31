import type { ZodType } from 'zod';

/**
 * Metadata describing an MCP prompt registration.
 */
export interface IMcpPromptMetadata {
    /** Unique name of the prompt. */
    readonly name: string;

    /** Human-readable title of the prompt. */
    readonly title?: string;

    /** Description of the prompt. */
    readonly description?: string;

    /** Zod schema defining the prompt's arguments. */
    readonly argsSchema?: Record<string, ZodType>;
}
