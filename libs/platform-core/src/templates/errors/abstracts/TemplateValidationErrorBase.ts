/**
 * Base error class for template validation errors.
 *
 * @public
 * @abstract
 */
export abstract class TemplateValidationErrorBase extends Error {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `TemplateValidationErrorBase` class.
     *
     * @public
     * @param message The error message.
     * @param code The error code.
     */
    protected constructor(
        message: string,
        public readonly code: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
