/**
 * Base error for all e-signing related failures.
 *
 * @public
 */
export class EsigningError extends Error {
    // #region Fields

    private readonly _code: string;

    // #endregion

    // #region Ctor

    public constructor(message: string, code: string) {
        super(message);
        this.name = 'EsigningError';
        this._code = code;
    }

    // #endregion

    // #region Properties

    /** Machine-readable error code. */
    public get code(): string {
        return this._code;
    }

    // #endregion
}
