import type { IFeatureFlagContext } from '../models/IFeatureFlagContext.js';
import type { IFeatureFlagEvaluation } from '../models/IFeatureFlagEvaluation.js';

/**
 * Abstract base for feature flag reader operations.
 * Each provider (Azure App Configuration, Vercel Edge Config) must implement this contract
 * so that the consuming application can switch providers without changing business logic.
 *
 * @public
 */
export abstract class FeatureFlagReaderBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Evaluates whether a feature flag is enabled.
     *
     * @public
     * @param key - The unique key identifying the feature flag.
     * @param context - Optional evaluation context for targeting and segmentation.
     * @returns `true` if the feature flag is enabled.
     */
    public abstract isEnabled(key: string, context?: IFeatureFlagContext): Promise<boolean>;

    /**
     * Returns the variant value of a feature flag for multivariate flags and A/B testing.
     *
     * @public
     * @param key - The unique key identifying the feature flag.
     * @param defaultValue - The default value to return if the flag is not found.
     * @param context - Optional evaluation context for targeting and segmentation.
     * @returns The variant value of the feature flag.
     */
    public abstract getVariant<T = unknown>(key: string, defaultValue: T, context?: IFeatureFlagContext): Promise<T>;

    /**
     * Returns all known feature flags with their current evaluation.
     *
     * @public
     * @param context - Optional evaluation context for targeting and segmentation.
     * @returns Array of evaluated feature flags.
     */
    public abstract getAllFlags(context?: IFeatureFlagContext): Promise<ReadonlyArray<IFeatureFlagEvaluation>>;

    /**
     * Refreshes the flag state from the remote provider.
     * Implementations should reload configuration from the upstream source.
     *
     * @public
     */
    public abstract refresh(): Promise<void>;

    /**
     * Lightweight connectivity check for the feature flag provider.
     * Override in adapters to perform a real API call.
     * Defaults to `true` if not overridden.
     *
     * @public
     * @returns `true` if the provider is reachable.
     */
    public async ping(): Promise<boolean> {
        return true;
    }

    // #endregion
}
