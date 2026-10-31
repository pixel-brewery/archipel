// #region Imports

import type { IDeviceInfo } from '@pixel-brewery/archipel-platform-core/device';
import { MappingService } from '@pixel-brewery/archipel-platform-mapping';
import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { SessionPersistenceBase } from '../abstracts/SessionPersistenceBase.js';
import type { ISessionRecord } from '../contracts/ISessionRecord.js';
import type { IIssuedSession } from '../models/IIssuedSession.js';
import { SessionRefreshOutcome } from '../models/SessionRefreshOutcome.js';
import type { ISessionRefreshResult } from '../models/ISessionRefreshResult.js';
import { SESSION_LIST_MAPPING_KEY } from '../mappers/SessionMappingProfile.js';
import { SessionResponse } from '../models/index.js';

// #endregion

/**
 * Manages user sessions via the {@link SessionPersistenceBase}.
 *
 * @remarks
 * A session is addressed by its own identifier, which the access token carries as the `sid` claim.
 * Access tokens are **never** persisted, so reissuing one leaves the session untouched and cannot
 * cut off a client that is still sending the previous token.
 *
 * The refresh credential belongs to the session rather than to the user, so every device keeps its
 * own and signing in elsewhere does not evict it. It is opaque and travels in the request body,
 * which lets a web portal, a native mobile application and a desktop application use one identical
 * exchange — no cookie, and therefore no browser assumption anywhere in the contract.
 *
 * The service owns credential generation and hashing. Applications decide the lifetimes, map the
 * outcomes to their own errors, and define what counts as activity.
 *
 * @example
 * ```typescript
 * // Sign in
 * const { session, refreshToken } = await sessionService.create(user.id, ip, sevenDaysInMillis, {
 *     deviceInfo,
 *     clientName: 'mobile-app'
 * });
 * const accessToken = await authTokenService.createAccessToken(user, session.id);
 *
 * // Every authenticated request
 * if (!(await sessionService.isActive(payload.sid, cutoff))) {
 *     throw new SessionExpiredError();
 * }
 *
 * // Renew after explicit user activity
 * await sessionService.updateLastActive(payload.sid);
 * ```
 *
 * @public
 */
@Injectable()
export class SessionService {
    // #region Fields

    private static readonly _REFRESH_TOKEN_BYTES = 48;

    private readonly _sessionPersistence: SessionPersistenceBase;
    private readonly _mappingService: MappingService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `SessionService` class.
     *
     * @public
     * @param sessionPersistence - The session persistence abstract base.
     * @param mappingService - The mapping service.
     */
    public constructor(sessionPersistence: SessionPersistenceBase, mappingService: MappingService) {
        this._sessionPersistence = sessionPersistence;
        this._mappingService = mappingService;
    }

    // #endregion

    // #region Methods

    /**
     * Hashes a refresh token for persistence and lookup.
     *
     * @remarks
     * The credential is high-entropy random data, so a plain SHA-256 is the right primitive here:
     * it is deterministic, which lookups need, and there is nothing to brute-force. Do not
     * substitute a password hash — those are deliberately slow and not equality-searchable.
     *
     * Exposed so adapters and tests can derive the same hash without reimplementing it.
     *
     * @public
     * @param refreshToken - The opaque refresh token.
     * @returns The hash that is stored instead of the token.
     */
    public static hashRefreshToken(refreshToken: string): string {
        return createHash('sha256').update(refreshToken).digest('hex');
    }

    /**
     * Opens a session and issues its refresh token.
     *
     * @remarks
     * The credential is 48 bytes of cryptographic randomness and is persisted as a hash only, so
     * the returned {@link IIssuedSession.refreshToken} is the single opportunity to hand it to the
     * client.
     *
     * Pass the identifier of the returned session to
     * {@link AuthTokenService.createAccessToken} — it becomes the `sid` claim that ties the token
     * to this session.
     *
     * @public
     * @param userId - The user identifier.
     * @param ipAddress - The client IP address.
     * @param refreshTokenLifetimeMillis - How long the issued refresh token stays acceptable.
     * @param options - Optional device, location and client details, plus the current moment.
     * @returns The created session together with the refresh token, which is returned exactly once.
     */
    public async create(
        userId: string,
        ipAddress: string,
        refreshTokenLifetimeMillis: number,
        options: {
            readonly deviceInfo?: IDeviceInfo;
            readonly location?: string;
            readonly clientName?: string;
            readonly now?: Date;
        } = {},
    ): Promise<IIssuedSession> {
        const now = options.now ?? new Date();
        const refreshToken = randomBytes(SessionService._REFRESH_TOKEN_BYTES).toString('base64url');
        const session = await this._sessionPersistence.create({
            userId,
            ipAddress,
            deviceInfo: options.deviceInfo,
            location: options.location,
            clientName: options.clientName,
            refreshTokenHash: SessionService.hashRefreshToken(refreshToken),
            refreshTokenExpiresAt: new Date(now.getTime() + refreshTokenLifetimeMillis),
        });

        return { session, refreshToken };
    }

    /**
     * Reads a session by its identifier.
     *
     * @public
     * @param sessionId - The session identifier.
     * @returns The session record or `null`.
     */
    public async findById(sessionId: string): Promise<ISessionRecord | null> {
        return this._sessionPersistence.findById(sessionId);
    }

    /**
     * Checks whether a session was active at or after a cutoff.
     *
     * @remarks
     * The cutoff is exclusive and supplied by the application, which keeps the timeout policy out
     * of the platform. A missing session and an idle one are intentionally indistinguishable to
     * the caller, so neither reveals more than the other.
     *
     * @public
     * @param sessionId - The session identifier, taken from the `sid` claim.
     * @param activeAfter - Exclusive last-active cutoff.
     * @returns `true` when the session exists and has not been idle past the cutoff.
     */
    public async isActive(sessionId: string, activeAfter: Date): Promise<boolean> {
        const session = await this._sessionPersistence.findById(sessionId);

        return session !== null && session.lastActive > activeAfter;
    }

    /**
     * Checks whether a user has any session active at or after a cutoff.
     *
     * @remarks
     * Loads every session of the subject, so keep that set bounded with
     * {@link SessionService.purgeInactive} rather than letting expired rows accumulate.
     *
     * @public
     * @param userId - The user identifier.
     * @param activeAfter - Exclusive last-active cutoff.
     * @returns `true` when at least one session has not been idle past the cutoff.
     */
    public async hasActiveSession(userId: string, activeAfter: Date): Promise<boolean> {
        const sessions = await this._sessionPersistence.findAllByUserId(userId);

        return sessions.some((session) => session.lastActive > activeAfter);
    }

    /**
     * Updates the last-active timestamp for a session.
     *
     * @remarks
     * Renews the inactivity window **in place**: no row is created and none is removed, so the
     * call is safe next to any concurrent request of the same session and the presented access
     * token keeps working.
     *
     * A session that no longer exists is silently ignored, which makes the call safe to fire
     * without awaiting it.
     *
     * @public
     * @param sessionId - The session identifier.
     */
    public async updateLastActive(sessionId: string): Promise<void> {
        const session = await this._sessionPersistence.findById(sessionId);

        if (session) {
            await this._sessionPersistence.updateLastActive(sessionId, new Date());
        }
    }

    /**
     * Exchanges a refresh token for its successor and reports what the exchange means.
     *
     * @remarks
     * The credential rotates on every use. A token that was already replaced can only reappear if
     * it was captured, so presenting it is treated as a replay: the session is revoked instead of
     * refreshed and a stolen credential is reduced to one failed attempt. See
     * {@link SessionRefreshOutcome} for the full set of answers.
     *
     * Rotation itself is a compare-and-swap in the persistence abstract base, so two clients exchanging the
     * same credential concurrently produce exactly one winner; the loser is reported as
     * {@link SessionRefreshOutcome.Unknown} rather than being handed a second token.
     *
     * The exchange never revives an idle session — the inactivity window stays the authority over
     * session lifetime.
     *
     * @public
     * @param refreshToken - The presented opaque refresh token.
     * @param refreshTokenLifetimeMillis - How long the issued refresh token stays acceptable.
     * @param activeAfter - Exclusive last-active cutoff the session must still satisfy.
     * @param now - The current moment.
     * @returns The outcome and, when refreshed, the session and its new refresh token.
     */
    public async refresh(refreshToken: string, refreshTokenLifetimeMillis: number, activeAfter: Date, now: Date = new Date()): Promise<ISessionRefreshResult> {
        const presentedHash = SessionService.hashRefreshToken(refreshToken);
        const session = await this._sessionPersistence.findByRefreshTokenHash(presentedHash);

        if (session === null) {
            return { outcome: SessionRefreshOutcome.Unknown };
        }

        if (session.previousRefreshTokenHash === presentedHash) {
            await this._sessionPersistence.invalidate(session.id);

            return { outcome: SessionRefreshOutcome.Replayed };
        }

        if (session.lastActive <= activeAfter) {
            return { outcome: SessionRefreshOutcome.Inactive };
        }

        if (session.refreshTokenExpiresAt !== null && session.refreshTokenExpiresAt <= now) {
            return { outcome: SessionRefreshOutcome.Expired };
        }

        const rotatedToken = randomBytes(SessionService._REFRESH_TOKEN_BYTES).toString('base64url');
        const rotated = await this._sessionPersistence.rotateRefreshToken({
            sessionId: session.id,
            expectedRefreshTokenHash: presentedHash,
            refreshTokenHash: SessionService.hashRefreshToken(rotatedToken),
            refreshTokenExpiresAt: new Date(now.getTime() + refreshTokenLifetimeMillis),
            lastActive: now,
        });

        if (!rotated) {
            return { outcome: SessionRefreshOutcome.Unknown };
        }

        return { outcome: SessionRefreshOutcome.Refreshed, session, refreshToken: rotatedToken };
    }

    /**
     * Lists all sessions for a user, marking the current one.
     *
     * @remarks
     * Intended for a "signed in on these devices" view. The current session is identified by the
     * `sid` claim of the requesting token, which is why a device can recognise itself in the list
     * without ever comparing tokens.
     *
     * @public
     * @param userId - The user identifier.
     * @param sessionId - The current session identifier.
     * @returns Array of session responses.
     */
    public async listSessions(userId: string, sessionId: string): Promise<Array<SessionResponse>> {
        const result = await this._sessionPersistence.findAllByUserId(userId);

        const input = result.map((x) => ({
            isCurrent: x.id === sessionId,
            session: x,
        }));

        return this._mappingService.map(SESSION_LIST_MAPPING_KEY, input);
    }

    /**
     * Invalidates a session by its record id.
     *
     * @remarks
     * Backs "sign out this other device". The owner is part of the condition, so an identifier
     * alone never ends a session belonging to somebody else.
     *
     * @public
     * @param sessionId - The session record identifier.
     * @param userId - The owning user identifier.
     * @returns `true` if a session was invalidated.
     */
    public async invalidateById(sessionId: string, userId: string): Promise<boolean> {
        return this._sessionPersistence.invalidateById(sessionId, userId);
    }

    /**
     * Invalidates a session by its identifier.
     *
     * @remarks
     * Backs an explicit sign-out of the current session. Ownership is not checked, so callers must
     * take the identifier from the authenticated token rather than from client input.
     *
     * @public
     * @param sessionId - The session identifier.
     * @returns `true` if a session was invalidated.
     */
    public async invalidate(sessionId: string): Promise<boolean> {
        return this._sessionPersistence.invalidate(sessionId);
    }

    /**
     * Removes the sessions of one user that were last active before a cutoff.
     *
     * @remarks
     * Expired sessions are unusable but stay readable, and every lookup by user loads all of them.
     * Calling this from an authenticated write — issuing tokens on sign-in is the natural place —
     * keeps the set bounded without a separate schedule, and stays idempotent and retry-safe.
     *
     * @public
     * @param userId - The owning user identifier.
     * @param activeBefore - Inclusive last-active cutoff.
     * @returns The number of removed sessions.
     */
    public async purgeInactive(userId: string, activeBefore: Date): Promise<number> {
        return this._sessionPersistence.deleteInactive(userId, activeBefore);
    }

    // #endregion
}
