/**
 * Optional atomic persistence for one-use MFA evidence across processes.
 *
 * Consumers opt in by providing this token beside their MFA subject adapter. Each operation must validate that
 * the subject and credential are still current and commit the consume decision atomically in durable storage.
 *
 * @public
 */
export abstract class MfaReplayPersistenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Consumes a verified TOTP counter only if it is newer than the consumed counter of the current secret.
     *
     * @public
     * @param subjectId - Subject of the verification.
     * @param secretFingerprint - SHA-256 hex fingerprint of the persisted encrypted channel secret.
     * @param timeStep - Exact RFC 6238 counter matched by cryptographic verification.
     * @returns Whether this call alone consumed the current credential's counter.
     */
    public abstract consumeTotpStep(subjectId: string, secretFingerprint: string, timeStep: number): Promise<boolean>;

    /**
     * Removes exactly one current backup hash while MFA remains enabled.
     *
     * @public
     * @param subjectId - Subject of the verification.
     * @param storedHash - Stored hash whose plaintext was cryptographically verified.
     * @returns Whether this call alone removed the current hash.
     */
    public abstract consumeBackupCode(subjectId: string, storedHash: string): Promise<boolean>;

    // #endregion
}
