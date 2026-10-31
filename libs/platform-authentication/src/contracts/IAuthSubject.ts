/**
 * Generic authentication subject returned by the {@link AuthSubjectBase}.
 * Represents any entity that can authenticate (user, service account, etc.).
 *
 * @public
 */
export interface IAuthSubject {
    // #region Properties

    /**
     * Unique identifier.
     */
    readonly id: string;

    /**
     * Login name (user name, email alias, etc.).
     */
    readonly userName: string | null;

    /**
     * Email address.
     */
    readonly email: string | null;

    /**
     * Hashed password. `null` for social-only accounts.
     */
    readonly password: string | null;

    /**
     * Whether the account has been verified (e.g. email confirmation).
     */
    readonly isVerified: boolean;

    /**
     * Whether the account is anonymous.
     */
    readonly isAnonymous: boolean;

    /**
     * Assigned role strings (e.g. `['user', 'admin']`).
     */
    readonly roles: ReadonlyArray<string>;

    /**
     * Whether MFA is enabled for this subject.
     */
    readonly mfaEnabled: boolean;

    // #endregion
}
