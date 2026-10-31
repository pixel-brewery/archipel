/**
 * Base class for document-related domain errors.
 *
 * @public
 * @abstract
 */
export abstract class DocumentErrorBase extends Error {
    // #region Fields

    public readonly code: string;

    // #endregion

    // #region Ctor

    protected constructor(message: string, code: string, cause?: unknown) {
        super(message, { cause });
        this.name = 'DocumentErrorBase';
        this.code = code;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
