import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import type { ISocialProfile } from '../contracts/ISocialProfile.js';

/**
 * Abstract base for resolving or creating subjects from social / OAuth profiles.
 * Used by all social strategies (GitHub, Google, Microsoft, Apple).
 *
 * @public
 */
export abstract class SocialAuthBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Find an existing subject matching the social profile,
     * or create a new one if none exists.
     *
     * @public
     * @param profile - The normalized social profile.
     * @returns The existing or newly created subject.
     */
    public abstract findOrCreateByProfile(profile: ISocialProfile): Promise<IAuthSubject>;

    // #endregion
}
