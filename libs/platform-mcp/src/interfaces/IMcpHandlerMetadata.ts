/**
 * Internal metadata stored for each decorated handler method.
 */
export interface IMcpHandlerMetadata {
    /** Type of MCP capability. */
    readonly type: 'tool' | 'resource' | 'prompt';

    /** The method name on the provider class. */
    readonly methodName: string;

    /** The metadata associated with the registration. */
    readonly metadata: Record<string, unknown>;
}
