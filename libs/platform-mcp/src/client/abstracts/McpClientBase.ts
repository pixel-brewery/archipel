import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';

/**
 * Defines bounded remote-tool operations for a caller-owned MCP connection.
 *
 * @remarks
 * Implementations own transport timeouts, sanitized errors and circuit-breaker policy. A failed initialization must be
 * cleaned up before a client is replaced. Remote tool effects may be non-idempotent; automatic retries require an
 * explicit server-side idempotency contract.
 * @public
 */
export abstract class McpClientBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Establishes one connection while sharing concurrent initialization.
     *
     * @returns Resolves when protocol initialization completes.
     * @throws {McpClientError} When initialization fails or the client has been closed.
     */
    public abstract connect(): Promise<void>;

    /**
     * Discovers a complete, bounded catalog across all server pages.
     *
     * @returns Validated remote tool declarations with unique names.
     * @throws {McpClientError} When discovery, pagination or catalog validation fails.
     */
    public abstract listTools(): Promise<ReadonlyArray<Tool>>;

    /**
     * Invokes one remote tool without automatically retrying an ambiguous effect.
     *
     * @remarks
     * MCP does not supply a generic idempotency key. Consumers must deduplicate mutations at the authoritative write
     * boundary or use a server-specific idempotency argument.
     * @param name - Exact remote tool identifier returned by discovery.
     * @param input - Arguments validated against that tool's input schema.
     * @param signal - Optional cancellation signal for the invocation.
     * @returns The standard MCP result, including content blocks and optional structured content.
     * @throws {McpClientError} When invocation or remote result validation fails.
     */
    public abstract callTool(name: string, input: Record<string, unknown>, signal?: AbortSignal): Promise<CallToolResult>;

    /**
     * Probes protocol readiness within an independent three-second budget.
     *
     * @returns Resolves when the remote protocol is ready.
     * @throws {McpClientError} When readiness cannot be confirmed within the health budget.
     */
    public abstract ping(): Promise<void>;

    /**
     * Closes the connection within a bounded cleanup budget.
     *
     * @returns Resolves when transport cleanup completes.
     * @throws {McpClientError} When transport cleanup fails.
     */
    public abstract close(): Promise<void>;

    // #endregion
}
