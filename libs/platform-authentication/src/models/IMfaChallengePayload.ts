/**
 * Represents the MFA challenge payload encoded in a challenge token.
 *
 * @public
 */
export interface IMfaChallengePayload {
    // #region Properties

    /**
     * Defines the token discriminator used to validate challenge tokens.
     */
    readonly type: 'mfa';

    /**
     * Identifies the authenticated user.
     */
    readonly userId: string;

    /**
     * Captures the originating IP address for the challenge.
     */
    readonly ipAddress: string;

    /**
     * Captures the originating user agent for the challenge.
     */
    readonly userAgent?: string;

    /**
     * Optional location associated with the login attempt.
     */
    readonly location?: string;

    /**
     * Optional client name associated with the login attempt.
     */
    readonly clientName?: string;

    // #endregion
}
