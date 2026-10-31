/**
 * Options for generating an OTP authentication URI (otpauth://).
 *
 * @public
 */
export interface IOtpUriOptions {
    /**
     * The issuer name displayed in the authenticator app.
     *
     * @public
     */
    readonly issuer: string;

    /**
     * The account label (e.g. email or username) shown in the authenticator app.
     *
     * @public
     */
    readonly label: string;

    /**
     * The shared secret used for TOTP generation.
     *
     * @public
     */
    readonly secret: string;
}

/**
 * Abstraction over OTP (One-Time Password) operations.
 *
 * Decouples consumers from any specific OTP library, making it easy
 * to swap implementations (e.g. upgrading from otplib v12 to v13)
 * without changing consumer code.
 *
 * @public
 */
export interface IOtpService {
    /**
     * Generates a cryptographically random secret suitable for TOTP.
     *
     * @public
     * @returns The generated secret string.
     */
    generateSecret(): string;

    /**
     * Generates an `otpauth://` URI for QR code enrollment.
     *
     * @public
     * @param options - The URI generation options.
     * @returns The formatted `otpauth://` URI.
     */
    generateUri(options: IOtpUriOptions): string;

    /**
     * Verifies a TOTP token against the given secret.
     *
     * The underlying comparison is **constant-time** (handled by the
     * otplib implementation), preventing timing-based side-channel attacks.
     *
     * @public
     * @param token - The one-time password to verify.
     * @param secret - The shared secret.
     * @returns `true` if the token is valid within the configured tolerance window.
     */
    verify(token: string, secret: string): boolean;

    /**
     * Verifies an HOTP (counter-based) token against the given secret and counter.
     *
     * @public
     * @param token - The one-time password to verify.
     * @param secret - The shared secret.
     * @param counter - The expected HOTP counter value.
     * @returns `true` if the token is valid for the given counter.
     */
    verifyHotp(token: string, secret: string, counter: number): Promise<boolean>;
}
