// #region Imports

import { Inject, Injectable, Optional } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { createHash, createHmac } from 'node:crypto';
import { BCRYPT_OPTIONS } from './BcryptTokens.js';
import { IBcryptOptions } from './IBcryptOptions.js';

// #endregion

/**
 * Minimum number of bcrypt salt rounds enforced by the service (OWASP ≥ 12).
 *
 * @public
 */
export const MIN_BCRYPT_ROUNDS = 12;

/**
 * Maximum password byte length that bcrypt processes without truncation.
 *
 * @public
 */
export const MAX_BCRYPT_PASSWORD_BYTES = 72;

/**
 * The `BcryptService` class.
 * Provides bcrypt hashing and comparison with configurable salt rounds,
 * optional pepper (HMAC pre-hash), and SHA-256 pre-hash for passwords
 * exceeding bcrypt's 72-byte input limit.
 *
 * @public
 */
@Injectable()
export class BcryptService {
    // #region Fields

    private readonly _rounds: number;
    private readonly _pepper: string | undefined;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `BcryptService` class.
     *
     * @param options - Optional bcrypt configuration. When omitted, defaults
     *   to 12 rounds and no pepper.
     */
    public constructor(@Optional() @Inject(BCRYPT_OPTIONS) options?: IBcryptOptions) {
        this._rounds = Math.max(options?.rounds ?? MIN_BCRYPT_ROUNDS, MIN_BCRYPT_ROUNDS);
        this._pepper = options?.pepper;
    }

    // #endregion

    // #region Methods

    /**
     * Hashes the given data using bcrypt with a generated salt.
     *
     * When a pepper is configured, the input is HMAC-SHA-256'd first,
     * which both adds a server-side secret and normalizes the length.
     * When no pepper is set but the input exceeds 72 bytes, a SHA-256
     * pre-hash is applied to prevent silent bcrypt truncation.
     *
     * @public
     * @param data - The data to be hashed.
     * @returns The bcrypt hash string.
     */
    public async hash(data: string): Promise<string> {
        const prepared = this.preparePassword(data);
        const salt = await genSalt(this._rounds);

        return hash(prepared, salt);
    }

    /**
     * Compares the given data with the encrypted data.
     *
     * Uses bcrypt's native `compare()` function which performs a
     * **constant-time** comparison internally, preventing timing-based
     * side-channel attacks. The same password preparation (pepper / SHA-256
     * pre-hash) is applied to the input before comparison so behaves
     * symmetrically with {@link BcryptService.hash}.
     *
     * @public
     * @param data - The data to be compared.
     * @param encrypted - The encrypted data to be compared.
     * @returns `true` if the data matches the encrypted hash; otherwise `false`.
     */
    public async compare(data: string, encrypted: string): Promise<boolean> {
        const prepared = this.preparePassword(data);

        return compare(prepared, encrypted);
    }

    /**
     * Prepares a password for bcrypt by applying pepper (if configured)
     * or SHA-256 pre-hashing for passwords exceeding bcrypt's 72-byte limit.
     *
     * When a pepper is configured, the password is HMAC-SHA-256'd with the
     * pepper key. This both adds the server-side secret and normalizes
     * the length to 64 hex characters (well under the 72-byte limit).
     *
     * When no pepper is set but the password exceeds 72 bytes,
     * a SHA-256 hash is applied to avoid silent truncation.
     */
    private preparePassword(data: string): string {
        if (this._pepper) {
            return createHmac('sha256', this._pepper).update(data).digest('hex');
        }

        if (Buffer.byteLength(data, 'utf8') > MAX_BCRYPT_PASSWORD_BYTES) {
            return createHash('sha256').update(data).digest('hex');
        }

        return data;
    }

    // #endregion
}
