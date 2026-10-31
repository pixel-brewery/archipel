/**
 * Represents a verifiable authentication subject.
 * Used by the {@link VerificationService} to verify email / PIN.
 *
 * @public
 */
export interface IVerifiableSubject {
    // #region Properties

    /**
     * Unique identifier.
     */
    readonly id: string;

    /**
     * Email address.
     */
    readonly email: string | null;

    /**
     * User / login name.
     */
    readonly userName: string | null;

    /**
     * Whether the account has already been verified.
     */
    readonly isVerified: boolean;

    /**
     * Current verification token stored on the entity.
     */
    readonly verificationToken: string | null;

    // #endregion
}
