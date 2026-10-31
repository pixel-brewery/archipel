/**
 * Error thrown when a configuration key cannot be resolved.
 *
 * @public
 */
export class ConfigKeyNotFoundError extends Error {
    // #region Fields

    private readonly _key: string;
    private readonly _source: string;

    // #endregion

    // #region Ctor

    public constructor(key: string, source: string) {
        super(`Config key: ${key} not found in ${source}`);
        this.name = 'ConfigKeyNotFoundError';
        this._key = key;
        this._source = source;
    }

    // #endregion

    // #region Properties

    /** Machine-readable error code. */
    public readonly code = 'CONFIG_KEY_NOT_FOUND';

    /** The configuration key that was not found. */
    public get key(): string {
        return this._key;
    }

    /** The source that was searched (e.g. `'process.env'`, a file path). */
    public get source(): string {
        return this._source;
    }

    // #endregion
}
