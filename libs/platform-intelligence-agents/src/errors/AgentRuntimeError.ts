/**
 * Sanitized failure at an agent runtime boundary.
 *
 * @public
 */
export class AgentRuntimeError extends Error {
    // #region Fields
    /**
     * Stable machine-readable failure category owned by the agent runtime package.
     */
    public readonly code: string;
    /**
     * Correlation identifier of the originating agent loop, when applicable.
     */
    public readonly loopId?: string;
    // #endregion

    // #region Ctor
    /**
     * Creates a library-owned failure without exposing provider diagnostics or credentials.
     *
     * @param code - Stable machine-readable failure category.
     * @param message - Sanitized explanation suitable for application error handling.
     * @param loopId - Correlation identifier of the affected loop, when available.
     */
    public constructor(code: string, message: string, loopId?: string) {
        super(message);
        this.name = 'AgentRuntimeError';
        this.code = code;
        this.loopId = loopId;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
