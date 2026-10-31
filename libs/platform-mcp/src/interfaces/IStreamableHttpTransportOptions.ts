/**
 * Options for creating a Streamable HTTP transport.
 */
export interface IStreamableHttpTransportOptions {
    /** Function to generate session IDs. Defaults to crypto.randomUUID. */
    readonly sessionIdGenerator?: () => string;

    /** Whether to enable JSON-only response mode (no SSE). */
    readonly enableJsonResponse?: boolean;
}
