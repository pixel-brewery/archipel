// #region Imports

import type { ISessionRecord } from '../contracts/ISessionRecord.js';

// #endregion

/**
 * A newly opened session together with the refresh token issued for it.
 *
 * @remarks
 * The refresh token is returned **exactly once**, here. Only its hash is persisted, so it cannot
 * be read back from the session afterwards — a caller that drops it has to open a new session.
 *
 * Hand it to the client in the same response as the access token and let the client store it
 * wherever its platform considers secure: the keychain on iOS, the keystore on Android, the
 * credential store on desktop, web storage in a browser. The platform deliberately makes no
 * assumption about that, which is why the credential is opaque rather than a cookie.
 *
 * @example
 * ```typescript
 * const { session, refreshToken } = await sessionService.create(user.id, ip, sevenDaysInMillis);
 * const accessToken = await authTokenService.createAccessToken(user, session.id);
 *
 * return { accessToken, refreshToken };
 * ```
 *
 * @public
 */
export interface IIssuedSession {
    // #region Properties

    /**
     * The persisted session, whose identifier belongs into the `sid` claim of the access token.
     */
    readonly session: ISessionRecord;

    /**
     * The opaque refresh token, in clear text and for the last time.
     */
    readonly refreshToken: string;

    // #endregion
}
