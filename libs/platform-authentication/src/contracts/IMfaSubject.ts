/**
 * Represents an MFA-enabled subject. Contains the data the MFA subsystem
 * needs to read and write MFA state on the underlying user-like entity.
 *
 * @public
 */
export interface IMfaSubject {
    // #region Properties

    /**
     * Unique identifier.
     */
    readonly id: string;

    /**
     * Email address, used by the email OTP channel.
     */
    readonly email: string | null;

    /**
     * User name, used as TOTP account label.
     */
    readonly userName: string | null;

    /**
     * Whether MFA is currently enabled.
     */
    readonly mfaEnabled: boolean;

    /**
     * Legacy TOTP secret (plain text). Used for migration to channel-based state.
     */
    readonly mfaSecret: string | null;

    /**
     * Hashed backup codes.
     */
    readonly mfaBackupCodes: ReadonlyArray<string>;

    /**
     * Preferred MFA method.
     */
    readonly mfaPreferredMethod: string | null;

    /**
     * Last time MFA was verified.
     */
    readonly mfaVerifiedAt: Date | null;

    /**
     * Serialized per-channel MFA state (JSON object).
     */
    readonly mfaChannels: unknown;

    /**
     * Phone number, used by the SMS channel.
     */
    readonly phoneNumber: string | null;

    // #endregion
}
