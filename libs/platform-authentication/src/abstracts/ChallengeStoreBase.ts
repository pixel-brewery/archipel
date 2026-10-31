import type { IMfaChallengeState } from '../services/ChallengeService.js';

/**
 * Abstract base for persisting MFA challenge state.
 *
 * The default implementation stores challenges in-memory (single instance only).
 * For multi-instance deployments, provide a Redis-backed implementation
 * via `IAuthModuleOptions.challengeStore`.
 *
 * @public
 */
export abstract class ChallengeStoreBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Store a challenge.
     *
     * @param id - The challenge identifier.
     * @param challenge - The challenge state to persist.
     */
    public abstract set(id: string, challenge: IMfaChallengeState): Promise<void>;

    /**
     * Retrieve a challenge by its identifier.
     *
     * @param id - The challenge identifier.
     * @returns The challenge state, or `undefined` if not found.
     */
    public abstract get(id: string): Promise<IMfaChallengeState | undefined>;

    /**
     * Remove a challenge by its identifier.
     *
     * @param id - The challenge identifier.
     */
    public abstract delete(id: string): Promise<void>;

    // #endregion
}
