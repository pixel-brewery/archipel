// #region Imports

import type { IDeviceInfo } from '@pixel-brewery/archipel-platform-core/device';

// #endregion

/**
 * Arguments for creating a new session.
 *
 * @remarks
 * The identifier is assigned by the persistence adapter and returned on the created
 * {@link ISessionRecord}; callers must not supply one. The access token is not part of these
 * arguments at all, because sessions are addressed by their own identifier rather than by a token.
 *
 * {@link SessionService.create} fills the refresh fields — build these arguments by hand only when
 * implementing an adapter test or an alternative session factory.
 *
 * @example
 * ```typescript
 * const session = await sessionPersistence.create({
 *     userId: subject.id,
 *     ipAddress: request.ip ?? '',
 *     deviceInfo,
 *     clientName: 'mobile-app',
 *     refreshTokenHash: SessionService.hashRefreshToken(refreshToken),
 *     refreshTokenExpiresAt: new Date(Date.now() + sevenDaysInMillis)
 * });
 * ```
 *
 * @public
 */
export interface ICreateSessionArgs {
    // #region Properties

    /**
     * Identifier of the authenticated subject the session belongs to.
     */
    readonly userId: string;

    /**
     * Client IP address observed while opening the session.
     */
    readonly ipAddress: string;

    /**
     * Device details derived from the request, when the application resolves them.
     */
    readonly deviceInfo?: IDeviceInfo;

    /**
     * Geolocation the session was opened from, when the application resolves one.
     */
    readonly location?: string;

    /**
     * Name the client identifies itself with, for example a portal or a mobile application.
     */
    readonly clientName?: string;

    /**
     * Hash of the refresh token issued together with the session.
     *
     * @remarks
     * Never the token itself — persisting the credential would defeat hashing it.
     */
    readonly refreshTokenHash: string;

    /**
     * Moment the issued refresh token stops being accepted.
     */
    readonly refreshTokenExpiresAt: Date;

    // #endregion
}
