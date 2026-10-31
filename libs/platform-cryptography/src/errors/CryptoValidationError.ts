import { CryptographyErrorBase } from './abstracts/CryptographyErrorBase.js';

/**
 * Thrown when a cryptographic operation receives invalid input.
 *
 * @public
 */
export class CryptoValidationError extends CryptographyErrorBase {
    // #region Ctor

    public constructor(message: string) {
        super(message, 'CRYPTO_VALIDATION');
        this.name = 'CryptoValidationError';
    }

    // #endregion
}
