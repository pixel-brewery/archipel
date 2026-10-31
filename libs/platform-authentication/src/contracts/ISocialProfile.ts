/**
 * Profile data received from a social / OAuth provider.
 *
 * @public
 */
export interface ISocialProfile {
    // #region Properties

    /**
     * The OAuth provider name (e.g. 'github', 'google', 'microsoft', 'apple').
     */
    readonly provider: string;

    /**
     * User name as reported by the provider.
     */
    readonly userName: string | null;

    /**
     * Email address as reported by the provider.
     */
    readonly email: string;

    /**
     * Display name.
     */
    readonly displayName: string | null;

    // #endregion
}
