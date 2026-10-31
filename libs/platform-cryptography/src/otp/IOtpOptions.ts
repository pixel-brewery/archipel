/**
 * Configuration options for {@link OtpService}.
 *
 * @public
 */
export interface IOtpOptions {
    /**
     * TOTP verification tolerance expressed in **seconds**.
     * Determines how many time steps before/after the current moment
     * are accepted during TOTP verification.
     *
     * @defaultValue 30
     * @public
     */
    readonly epochTolerance?: number;
}
