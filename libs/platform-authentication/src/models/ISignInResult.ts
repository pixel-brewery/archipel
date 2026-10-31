/**
 * Represents the outcome of a sign-in attempt.
 *
 * @public
 */
export interface ISignInResult {
    // #region Properties

    /**
     * Indicates whether a multi-factor token is required.
     */
    readonly mfaRequired: boolean;

    /**
     * Indicates whether email verification is required.
     */
    readonly verificationRequired?: boolean;

    /**
     * Contains the issued access token when MFA is not required.
     */
    readonly accessToken?: string;

    /**
     * Contains the challenge identifier required to complete MFA.
     */
    readonly challengeId?: string;

    /**
     * Lists enabled MFA methods available for the challenge.
     */
    readonly methods?: ReadonlyArray<string>;

    /**
     * Indicates the preferred MFA method.
     */
    readonly preferredMethod?: string;

    // #endregion
}
