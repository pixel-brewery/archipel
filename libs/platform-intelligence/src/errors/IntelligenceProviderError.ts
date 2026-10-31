/**
 * Error thrown when an intelligence provider call fails.
 *
 * @public
 */
export class IntelligenceProviderError extends Error {
    // #region Fields

    public readonly code = 'INTELLIGENCE_PROVIDER';
    public readonly provider: string;
    public readonly model: string;
    public readonly isRetryable: boolean;

    // #endregion

    // #region Ctor

    public constructor(message: string, provider: string, model: string, isRetryable: boolean, cause?: Error) {
        super(message);
        this.name = 'IntelligenceProviderError';
        this.provider = provider;
        this.model = model;
        this.isRetryable = isRetryable;
        if (cause) {
            this.cause = cause;
        }
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    // #endregion
}
