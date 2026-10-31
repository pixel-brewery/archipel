/**
 * Represents the data required to onboard a multi-factor authenticator.
 *
 * @public
 */
export interface IMfaSetup {
    // #region Properties

    /**
     * Contains the shared secret in Base32 format.
     */
    readonly secret?: string;

    /**
     * Identifies the MFA method being provisioned.
     */
    readonly method: string;

    /**
     * Contains the provisioning URI compatible with authenticator applications.
     */
    readonly otpauthUrl?: string;

    /**
     * Provides a pre-rendered QR code in data URL form.
     */
    readonly quickResponseCodeDataUrl?: string;

    // #endregion
}
