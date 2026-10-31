/**
 * Represents a persisted session record.
 *
 * @remarks
 * A session is identified by its own {@link ISessionRecord.id}, which every access token carries
 * as the `sid` claim. Access tokens themselves are **never** persisted. Reissuing one therefore
 * leaves the session untouched, and a client that is still sending the previous token keeps
 * working until it picks the new one up.
 *
 * The refresh credential is bound to this record rather than to the user, so a person signing in
 * on a second device does not evict the first. Only hashes are stored: the tokens themselves
 * exist exactly once, in the response that issued them.
 *
 * @example
 * ```typescript
 * const session = await sessionPersistence.findById(sessionId);
 *
 * if (session !== null && session.lastActive > cutoff) {
 *     // The session is inside its inactivity window.
 * }
 * ```
 *
 * @public
 */
export interface ISessionRecord {
    // #region Properties

    /**
     * Stable identifier of the session, carried by access tokens as the `sid` claim.
     */
    readonly id: string;

    /**
     * Identifier of the authenticated subject the session belongs to.
     */
    readonly userId: string;

    /**
     * Client IP address observed when the session was opened.
     */
    readonly ipAddress: string;

    /**
     * Raw user-agent header, or `null` when the client did not send one.
     *
     * @remarks
     * Native applications frequently omit it, so absence carries no meaning beyond "unknown".
     */
    readonly userAgent: string | null;

    /**
     * Device category derived from the user agent, or `null` when it could not be determined.
     */
    readonly deviceType: string | null;

    /**
     * Human-readable device name, or `null` when the client did not supply one.
     */
    readonly deviceName: string | null;

    /**
     * Browser name derived from the user agent, or `null` for non-browser clients.
     */
    readonly browserName: string | null;

    /**
     * Browser version derived from the user agent, or `null` for non-browser clients.
     */
    readonly browserVersion: string | null;

    /**
     * Operating system name derived from the user agent, or `null` when unknown.
     */
    readonly osName: string | null;

    /**
     * Operating system version derived from the user agent, or `null` when unknown.
     */
    readonly osVersion: string | null;

    /**
     * Geolocation the session was opened from, or `null` when the application does not resolve one.
     */
    readonly location: string | null;

    /**
     * Name the client identified itself with, or `null` when it did not.
     *
     * @remarks
     * Useful for telling a web portal, a mobile application and an integration apart in a session
     * list, since all three authenticate the same way.
     */
    readonly clientName: string | null;

    /**
     * Hash of the refresh token that is currently valid for this session, or `null` when the
     * session cannot be refreshed.
     *
     * @remarks
     * The refresh token itself is never persisted. Compare against
     * {@link SessionService.hashRefreshToken} instead of against a stored token.
     */
    readonly refreshTokenHash: string | null;

    /**
     * Hash of the refresh token this session used before the last rotation, or `null` when it has
     * not been rotated yet.
     *
     * @remarks
     * Keeping the replaced hash is what makes a replayed credential detectable: presenting it
     * again cannot be a legitimate exchange, so {@link SessionService.refresh} revokes the whole
     * session instead of issuing another token.
     */
    readonly previousRefreshTokenHash: string | null;

    /**
     * Moment the current refresh token stops being accepted, or `null` when it does not expire on
     * its own.
     */
    readonly refreshTokenExpiresAt: Date | null;

    /**
     * Moment the session was last recorded as active.
     *
     * @remarks
     * What counts as activity is the application's decision. Registering
     * {@link LastActiveMiddleware} makes every authenticated request count; products that require
     * literal user interaction renew this from an explicit endpoint instead.
     */
    readonly lastActive: Date;

    /**
     * Moment the session was opened.
     */
    readonly createdAt: Date;

    // #endregion
}
