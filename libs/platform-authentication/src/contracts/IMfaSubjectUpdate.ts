/**
 * Data payload for updating MFA state on the underlying entity.
 * All properties are optional - only the provided ones are applied.
 *
 * @public
 */
export interface IMfaSubjectUpdate {
    // #region Properties

    readonly mfaEnabled?: boolean;
    readonly mfaSecret?: string | null;
    readonly mfaBackupCodes?: string[];
    readonly mfaPreferredMethod?: string | null;
    readonly mfaVerifiedAt?: Date | null;
    readonly mfaUpdatedAt?: Date;
    readonly mfaChannels?: unknown;
    readonly phoneNumber?: string;

    // #endregion
}
