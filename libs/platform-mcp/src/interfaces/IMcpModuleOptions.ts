/**
 * Options for configuring the MCP module.
 */
export interface IMcpModuleOptions {
    /** Name of the MCP server (exposed to clients). */
    readonly name: string;

    /** Version of the MCP server (exposed to clients). */
    readonly version: string;

    /** Optional server capabilities to advertise. */
    readonly capabilities?: {
        readonly logging?: Record<string, unknown>;
        readonly prompts?: { readonly listChanged?: boolean };
        readonly resources?: { readonly subscribe?: boolean; readonly listChanged?: boolean };
        readonly tools?: { readonly listChanged?: boolean };
    };

    /** Optional server instructions for clients. */
    readonly instructions?: string;
}
