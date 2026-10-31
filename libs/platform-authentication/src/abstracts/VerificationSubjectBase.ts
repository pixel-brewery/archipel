import type { IVerifiableSubject } from '../contracts/IVerifiableSubject.js';

/**
 * Abstract base for verifiable subject persistence.
 * Used by the VerificationService to manage email/PIN verification.
 *
 * @public
 */
export abstract class VerificationSubjectBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Find a subject by login (user name or email).
     *
     * @public
     * @param login - The login identifier.
     * @returns The verifiable subject or `null`.
     */
    public abstract findByLogin(login: string): Promise<IVerifiableSubject | null>;

    /**
     * Find a subject by its current verification token.
     *
     * @public
     * @param token - The verification token string.
     * @returns The subject or `null`.
     */
    public abstract findByVerificationToken(token: string): Promise<IVerifiableSubject | null>;

    /**
     * Store a verification token on the subject.
     *
     * @public
     * @param id - The subject identifier.
     * @param token - The verification token to store.
     */
    public abstract setVerificationToken(id: string, token: string | null): Promise<void>;

    /**
     * Mark the subject as verified and clear the token.
     *
     * @public
     * @param id - The subject identifier.
     */
    public abstract markVerified(id: string): Promise<void>;

    // #endregion
}
