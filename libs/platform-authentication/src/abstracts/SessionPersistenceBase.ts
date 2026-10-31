import type { ICreateSessionArgs } from '../contracts/ICreateSessionArgs.js';
import type { IRotateRefreshTokenArgs } from '../contracts/IRotateRefreshTokenArgs.js';
import type { ISessionRecord } from '../contracts/ISessionRecord.js';

/**
 * Abstract base for persisting and querying sessions.
 *
 * @remarks
 * Sessions are addressed by their own identifier, **never** by an access token. Reissuing an
 * access token therefore neither creates nor removes a session, which is what allows a client to
 * keep using the previous token until it has adopted the new one.
 *
 * The abstract base stores refresh credentials as hashes only and exposes rotation as a compare-and-swap
 * (see {@link IRotateRefreshTokenArgs}), so concurrent exchanges cannot both succeed. Everything
 * about the credential is transport-neutral: no cookie, no browser assumption, which is what lets
 * native mobile and desktop clients use the same session model as a web portal.
 *
 * Implement it in the consuming application and register it through
 * `AuthModule.register({ sessionPersistence: … })`.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PrismaSessionAdapter extends SessionPersistenceBase {
 *     public constructor(private readonly _sessions: SessionRepository) {
 *         super();
 *     }
 *
 *     public override async create(args: ICreateSessionArgs): Promise<ISessionRecord> {
 *         return this._sessions.create(args);
 *     }
 *
 *     // … remaining members
 * }
 * ```
 *
 * @public
 */
export abstract class SessionPersistenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Create a session.
     *
     * @remarks
     * The adapter assigns the identifier and returns the stored record, because the caller needs
     * that identifier for the `sid` claim of the access token it is about to issue.
     *
     * @public
     * @param args - The session data to store.
     * @returns The created session record.
     */
    public abstract create(args: ICreateSessionArgs): Promise<ISessionRecord>;

    /**
     * Find a session by its identifier.
     *
     * @remarks
     * This is the lookup every authenticated request performs, using the `sid` claim of the
     * presented access token. It should be backed by the primary key.
     *
     * @public
     * @param id - The session identifier.
     * @returns The session record or `null`.
     */
    public abstract findById(id: string): Promise<ISessionRecord | null>;

    /**
     * Find the session a refresh token belongs to, whether that token is the current one or the
     * one it replaced.
     *
     * @remarks
     * Matching {@link ISessionRecord.previousRefreshTokenHash} as well is deliberate and required:
     * it is the only way {@link SessionService.refresh} can tell a replayed credential from an
     * unknown one. An adapter that matches the current hash alone silently disables replay
     * detection.
     *
     * @public
     * @param refreshTokenHash - Hash of the presented refresh token.
     * @returns The session record or `null`.
     */
    public abstract findByRefreshTokenHash(refreshTokenHash: string): Promise<ISessionRecord | null>;

    /**
     * Find all sessions for a given user.
     *
     * @public
     * @param userId - The user identifier.
     * @returns Sessions ordered by last activity descending.
     */
    public abstract findAllByUserId(userId: string): Promise<ReadonlyArray<ISessionRecord>>;

    /**
     * Update the last-active timestamp for a session.
     *
     * @remarks
     * Renews the inactivity window in place. It neither creates nor removes a row, so it can run
     * concurrently with any request of the same session.
     *
     * @public
     * @param id - The session identifier.
     * @param date - The new last-active date.
     */
    public abstract updateLastActive(id: string, date: Date): Promise<void>;

    /**
     * Replace the refresh token of a session, but only while the expected hash is still the
     * current one.
     *
     * @remarks
     * Must be a single conditional write. See {@link IRotateRefreshTokenArgs} for the reasoning
     * and a reference implementation.
     *
     * @public
     * @param args - The rotation data.
     * @returns `true` when the session was rotated, `false` when the expected hash was no longer
     * current.
     */
    public abstract rotateRefreshToken(args: IRotateRefreshTokenArgs): Promise<boolean>;

    /**
     * Invalidate (delete) a session by its identifier.
     *
     * @public
     * @param id - The session identifier.
     * @returns `true` if a session was invalidated.
     */
    public abstract invalidate(id: string): Promise<boolean>;

    /**
     * Invalidate (delete) a session by its identifier and owning user id.
     *
     * @remarks
     * The owner is part of the condition so that one subject can never end another subject's
     * session by guessing an identifier.
     *
     * @public
     * @param id - The session identifier.
     * @param userId - The owning user identifier.
     * @returns `true` if a session was invalidated.
     */
    public abstract invalidateById(id: string, userId: string): Promise<boolean>;

    /**
     * Remove the sessions of one user that were last active before a cutoff.
     *
     * @remarks
     * Expired sessions are unusable but stay readable, and {@link findAllByUserId} loads all of
     * them. Purging bounds that set without a separate schedule when it is called from an
     * authenticated write such as issuing tokens.
     *
     * @public
     * @param userId - The owning user identifier.
     * @param activeBefore - Inclusive last-active cutoff.
     * @returns The number of removed sessions.
     */
    public abstract deleteInactive(userId: string, activeBefore: Date): Promise<number>;

    // #endregion
}
