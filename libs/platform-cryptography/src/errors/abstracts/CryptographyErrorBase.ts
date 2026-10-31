/**
 * Base class for cryptography-related domain errors.
 *
 * @public
 * @abstract
 */
export abstract class CryptographyErrorBase extends Error {
    // #region Fields

    public readonly code: string;

    // #endregion

    // #region Ctor

    protected constructor(message: string, code: string) {
        super(message);
        this.name = 'CryptographyErrorBase';
        this.code = code;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
