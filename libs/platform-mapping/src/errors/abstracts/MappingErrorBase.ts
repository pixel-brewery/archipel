/**
 * Base class for mapping related domain errors.
 *
 * @public
 * @abstract
 */
export abstract class MappingErrorBase extends Error {
    // #region Fields

    public readonly code: string;

    // #endregion

    // #region Ctor

    protected constructor(message: string, code: string) {
        super(message);
        this.code = code;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
