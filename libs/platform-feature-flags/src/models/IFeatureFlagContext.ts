/**
 * Context passed to feature flag evaluation for targeting and segmentation.
 *
 * @public
 */
export interface IFeatureFlagContext {
    /** Unique identifier of the current user. */
    readonly userId?: string;

    /** Groups or segments the user belongs to (e.g. beta testers, enterprise). */
    readonly groups?: ReadonlyArray<string>;

    /** Arbitrary attributes for custom targeting rules. */
    readonly attributes?: Readonly<Record<string, unknown>>;
}
