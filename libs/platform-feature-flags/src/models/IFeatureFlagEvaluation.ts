/**
 * Result of evaluating a single feature flag.
 *
 * @public
 */
export interface IFeatureFlagEvaluation {
    /** The unique key identifying the feature flag. */
    readonly key: string;

    /** Whether the feature flag is currently enabled. */
    readonly enabled: boolean;

    /** Optional variant value for multivariate flags / A/B testing. */
    readonly variant?: unknown;
}
