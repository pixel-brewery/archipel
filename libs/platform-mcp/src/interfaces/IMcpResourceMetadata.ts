/**
 * Metadata describing an MCP resource registration.
 */
export interface IMcpResourceMetadata {
    /** Unique name of the resource. */
    readonly name: string;

    /**
     * URI or URI template for the resource.
     * Use a plain string for static resources, or a `ResourceTemplate` pattern
     * (e.g. `users://{userId}/profile`) for dynamic resources.
     */
    readonly uri: string;

    /** Human-readable title of the resource. */
    readonly title?: string;

    /** Description of the resource. */
    readonly description?: string;

    /** MIME type of the resource content. */
    readonly mimeType?: string;
}
