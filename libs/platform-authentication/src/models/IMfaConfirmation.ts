/**
 * Represents the activation result for multi-factor authentication.
 *
 * @public
 */
export interface IMfaConfirmation {
    // #region Properties

    /**
     * Contains one-time recovery codes presented to the user.
     */
    readonly backupCodes: ReadonlyArray<string>;

    // #endregion
}
