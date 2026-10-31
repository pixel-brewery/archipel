/**
 * Represents a sanitized configuration, protocol or lifecycle failure at the MCP client boundary.
 *
 * @public
 */
export class McpClientError extends Error {
    // #region Fields

    /**
     * Stable machine-readable failure category owned by the MCP library.
     */
    public readonly code: string;

    // #endregion

    // #region Ctor

    /**
     * Creates a failure without exposing endpoint credentials or remote provider diagnostics.
     *
     * @param code - Stable category used by the consuming application to handle the failure.
     * @param message - Sanitized explanation suitable for operational error handling.
     */
    public constructor(code: string, message: string) {
        super(message);
        this.name = 'McpClientError';
        this.code = code;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
