import type { ZodType } from 'zod';

/**
 * Metadata describing an MCP tool registration.
 */
export interface IMcpToolMetadata {
    /** Unique name of the tool. */
    readonly name: string;

    /** Human-readable title of the tool. */
    readonly title?: string;

    /** Description of what the tool does. */
    readonly description?: string;

    /** Zod schema defining the tool's input parameters. */
    readonly inputSchema?: Record<string, ZodType>;

    /** Zod schema defining the tool's structured output. */
    readonly outputSchema?: Record<string, ZodType>;

    /** Annotations for the tool (e.g. readOnlyHint, destructiveHint). */
    readonly annotations?: Record<string, unknown>;

    /** Required scopes checked against SDK `authInfo.scopes`; trusted legacy `extra.scopes` remains supported. */
    readonly requiredScopes?: ReadonlyArray<string>;
}
