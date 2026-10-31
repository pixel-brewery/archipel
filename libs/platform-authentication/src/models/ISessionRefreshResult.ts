// #region Imports

import type { ISessionRecord } from '../contracts/ISessionRecord.js';
import type { SessionRefreshOutcome } from './SessionRefreshOutcome.js';

// #endregion

/**
 * Outcome of a refresh-token exchange.
 *
 * @remarks
 * {@link ISessionRefreshResult.session} and {@link ISessionRefreshResult.refreshToken} are present
 * only when {@link ISessionRefreshResult.outcome} is {@link SessionRefreshOutcome.Refreshed}.
 * Branch on the outcome before reading them rather than testing them for presence, so that a new
 * failing outcome cannot be mistaken for a successful exchange.
 *
 * @example
 * ```typescript
 * const result = await sessionService.refresh(refreshToken, lifetimeMillis, cutoff);
 *
 * if (result.outcome !== SessionRefreshOutcome.Refreshed) {
 *     throw new InvalidRefreshTokenError();
 * }
 *
 * const accessToken = await authTokenService.createAccessToken(subject, result.session!.id);
 * ```
 *
 * @public
 */
export interface ISessionRefreshResult {
    // #region Properties

    /**
     * What the exchange means.
     */
    readonly outcome: SessionRefreshOutcome;

    /**
     * The refreshed session, present only on {@link SessionRefreshOutcome.Refreshed}.
     */
    readonly session?: ISessionRecord;

    /**
     * The successor refresh token, present only on {@link SessionRefreshOutcome.Refreshed} and
     * returned exactly once.
     */
    readonly refreshToken?: string;

    // #endregion
}
