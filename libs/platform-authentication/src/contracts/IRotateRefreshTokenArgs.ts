/**
 * Arguments for replacing the refresh token of an existing session.
 *
 * @remarks
 * The rotation is deliberately expressed as a compare-and-swap:
 * {@link IRotateRefreshTokenArgs.expectedRefreshTokenHash} must still be the session's current
 * hash for the update to apply. Two clients that exchange the same credential concurrently — a
 * mobile application resuming from background while its own retry is still in flight, for
 * instance — therefore produce exactly one winner, and the loser is told the credential is no
 * longer current instead of both receiving a token.
 *
 * Adapters must implement this as a single conditional statement. Reading the session first and
 * writing afterwards reintroduces the race the contract exists to prevent.
 *
 * @example
 * ```typescript
 * public override async rotateRefreshToken(args: IRotateRefreshTokenArgs): Promise<boolean> {
 *     const result = await this.sessions.updateMany({
 *         where: { id: args.sessionId, refreshTokenHash: args.expectedRefreshTokenHash },
 *         data: {
 *             refreshTokenHash: args.refreshTokenHash,
 *             previousRefreshTokenHash: args.expectedRefreshTokenHash,
 *             refreshTokenExpiresAt: args.refreshTokenExpiresAt,
 *             lastActive: args.lastActive
 *         }
 *     });
 *
 *     return result.count > 0;
 * }
 * ```
 *
 * @public
 */
export interface IRotateRefreshTokenArgs {
    // #region Properties

    /**
     * Identifier of the session whose credential is replaced.
     */
    readonly sessionId: string;

    /**
     * Hash that must still be current for the rotation to apply.
     *
     * @remarks
     * Adapters store it as {@link ISessionRecord.previousRefreshTokenHash} while replacing it, so
     * a later replay of the same credential remains detectable.
     */
    readonly expectedRefreshTokenHash: string;

    /**
     * Hash of the refresh token that replaces it.
     */
    readonly refreshTokenHash: string;

    /**
     * Moment the replacing refresh token stops being accepted.
     */
    readonly refreshTokenExpiresAt: Date;

    /**
     * Moment the rotation is recorded as activity.
     *
     * @remarks
     * A successful exchange proves the client is still there, so it renews the inactivity window
     * along with the credential.
     */
    readonly lastActive: Date;

    // #endregion
}
