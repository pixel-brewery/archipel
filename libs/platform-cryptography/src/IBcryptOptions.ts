/**
 * Configuration options for {@link BcryptService}.
 *
 * @public
 */
export interface IBcryptOptions {
    /**
     * Number of bcrypt salt rounds. Must be ≥ 12 (OWASP recommendation).
     * Values below the minimum are clamped to 12.
     *
     * @defaultValue 12
     * @public
     */
    readonly rounds?: number;

    /**
     * Optional server-side pepper used as an HMAC key. When provided,
     * every password is HMAC-SHA-256'd with this pepper before bcrypt
     * hashing, adding a server-side secret layer and normalizing the
     * password length to 64 hex characters (well within the 72-byte limit).
     *
     * @public
     */
    readonly pepper?: string;
}
