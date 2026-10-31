/**
 * Request-scoped context for feature access checks and usage recording.
 *
 * @public
 */
export interface IFeatureAccessContext {
    // #region Properties

    /**
     * Authenticated user identifier resolved by the guard.
     */
    readonly userId: string;

    /**
     * Optional tenant identifier when the authenticated subject carries tenancy context.
     */
    readonly tenantId?: string | number;

    /**
     * Original authenticated subject from the request.
     */
    readonly subject?: unknown;

    // #endregion
}
