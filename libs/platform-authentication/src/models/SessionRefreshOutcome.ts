/**
 * Result of exchanging a refresh token.
 *
 * @remarks
 * The exchange reports why it ended rather than throwing, because the five outcomes call for
 * different answers: only {@link SessionRefreshOutcome.Replayed} indicates a possible theft, and
 * only it revokes the session. Everything else simply means the caller has to sign in again.
 *
 * All failing outcomes should reach the client as the same opaque error. Telling an attacker
 * whether a credential was unknown, expired or merely idle hands them a probing oracle.
 *
 * @example
 * ```typescript
 * const result = await sessionService.refresh(refreshToken, lifetimeMillis, cutoff);
 *
 * switch (result.outcome) {
 *     case SessionRefreshOutcome.Refreshed:
 *         return this.issueTokens(result.session!, result.refreshToken!);
 *     case SessionRefreshOutcome.Replayed:
 *         this._logger.warn(`Refresh token replay detected userId=${userId}`);
 *         throw new InvalidRefreshTokenError();
 *     default:
 *         throw new InvalidRefreshTokenError();
 * }
 * ```
 *
 * @public
 */
export enum SessionRefreshOutcome {
    /**
     * The exchange succeeded and issued a successor token.
     *
     * @remarks
     * The session and the new credential are present on the result.
     */
    Refreshed = 'REFRESHED',

    /**
     * No session holds the presented token.
     *
     * @remarks
     * Also reported when a concurrent exchange won the rotation, because from this caller's point
     * of view the credential it presented is no longer current either way.
     */
    Unknown = 'UNKNOWN',

    /**
     * The presented token had already been replaced, so the session was revoked.
     *
     * @remarks
     * A rotated credential can only reappear if it was captured or leaked. The session is ended
     * rather than refreshed, which turns a stolen token into a single failed attempt. Worth
     * logging and, depending on the product, worth notifying the account owner about.
     */
    Replayed = 'REPLAYED',

    /**
     * The session left its inactivity window.
     *
     * @remarks
     * A refresh credential does not revive an idle session; the inactivity window remains the
     * authority over how long a session lives.
     */
    Inactive = 'INACTIVE',

    /**
     * The presented token outlived its own validity.
     */
    Expired = 'EXPIRED',
}
