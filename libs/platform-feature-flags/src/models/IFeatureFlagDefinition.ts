/**
 * Represents a full feature flag definition for admin operations (create / update / read).
 *
 * @public
 */
export interface IFeatureFlagDefinition {
    /** Unique key identifying the feature flag. */
    readonly key: string;

    /** Whether the feature flag is currently enabled. */
    readonly enabled: boolean;

    /** Optional human-readable description. */
    readonly description?: string;

    /** Optional label / environment tag (e.g. `"production"`, `"staging"`). */
    readonly label?: string;

    /** Optional variant value for multivariate flags. */
    readonly variant?: unknown;
}
