/**
 * The `ConfigStrategyBase` class.
 * Represents the base class for configuration strategies.
 *
 * @public
 * @abstract
 */
export abstract class ConfigStrategyBase {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `ConfigStrategyBase` class.
     */
    protected constructor() {
        //
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * `initialize` - Initializes the configuration.
     */
    public abstract initialize(): void;

    /**
     * `resolve` - Resolves the configuration.
     *
     * @param key - The key to resolve.
     * @returns The resolved configuration value.
     */
    public abstract resolve<T>(key: string): T;

    public abstract tryResolve<T>(key: string, fallback: T): T;

    public abstract has(key: string): boolean;

    // #endregion
}
