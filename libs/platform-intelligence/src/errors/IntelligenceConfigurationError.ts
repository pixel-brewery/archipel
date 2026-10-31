/**
 * Error thrown when an intelligence provider configuration is invalid or missing.
 *
 * @public
 */
export class IntelligenceConfigurationError extends Error {
    // #region Fields

    public readonly code = 'INTELLIGENCE_CONFIGURATION';

    // #endregion

    // #region Ctor

    public constructor(message: string) {
        super(message);
        this.name = 'IntelligenceConfigurationError';
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    // #endregion
}
