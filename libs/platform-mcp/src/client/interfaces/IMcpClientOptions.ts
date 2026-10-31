/**
 * Explicit MCP connection settings; credentials must be supplied by the consumer's ConfigService.
 *
 * @public
 */
export interface IMcpClientOptions {
    /**
     * Streamable HTTP endpoint supplied by consumer configuration.
     */
    readonly url: string;
    /**
     * Optional bearer credential supplied by consumer configuration and never included in logs.
     */
    readonly authToken?: string;
    /**
     * Additional request headers supplied by the consumer.
     */
    readonly headers?: Readonly<Record<string, string>>;
    /**
     * Client name advertised during MCP protocol initialization; defaults to archipel-mcp-client.
     */
    readonly name?: string;
    /**
     * Connection and operation timeout in milliseconds; defaults to 5000, with a supported range of 1–60000.
     */
    readonly timeoutMs?: number;
    /**
     * Maximum discovered tools per client; defaults to 128 and cannot exceed 1024.
     */
    readonly maxTools?: number;
}
