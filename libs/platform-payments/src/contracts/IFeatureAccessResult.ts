/**
 * Result of a feature access check.
 *
 * @public
 */
export interface IFeatureAccessResult {
    // #region Properties

    /**
     * Whether the user is allowed to use the feature.
     */
    readonly allowed: boolean;

    /**
     * Current usage count for the feature in the active period.
     */
    readonly used: number;

    /**
     * Maximum allowed usage count. `-1` means unlimited.
     */
    readonly limit: number;

    /**
     * Remaining usage count. `-1` means unlimited.
     */
    readonly remaining: number;

    /**
     * When the current usage period resets.
     */
    readonly resetAt: Date;

    // #endregion
}
