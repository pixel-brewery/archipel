import type { IAuthSubject } from '../contracts/IAuthSubject.js';

/**
 * Abstract base for resolving authentication subjects by identity.
 * Used by the JWT, Local, and Anonymous strategies.
 *
 * @public
 */
export abstract class AuthSubjectBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Find a subject by its unique identifier.
     *
     * @public
     * @param id - The subject identifier.
     * @returns The subject or `null`.
     */
    public abstract findById(id: string): Promise<IAuthSubject | null>;

    /**
     * Find a subject by its login name (user name or email).
     *
     * @public
     * @param login - The login identifier.
     * @returns The subject or `null`.
     */
    public abstract findByLogin(login: string): Promise<IAuthSubject | null>;

    /**
     * Find the anonymous / seed subject by user name.
     *
     * @public
     * @param userName - The anonymous user name.
     * @returns The subject or `null`.
     */
    public abstract findAnonymous(userName: string): Promise<IAuthSubject | null>;

    // #endregion
}
