/**
 * Domain error thrown when a feature flag operation fails.
 *
 * @public
 */
export class FeatureFlagError extends Error {
    // #region Fields

    public readonly code = 'FEATURE_FLAG';
    public readonly provider: string;

    // #endregion

    // #region Ctor

    public constructor(provider: string, message: string, cause?: unknown) {
        super(message, { cause });
        this.name = 'FeatureFlagError';
        this.provider = provider;
    }

    // #endregion
}
