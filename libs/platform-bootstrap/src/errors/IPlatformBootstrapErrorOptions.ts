/**
 * Additional details for platform bootstrap errors.
 *
 * @public
 */
export interface IPlatformBootstrapErrorOptions {
    /** Original error that caused the bootstrap failure. */
    readonly cause?: unknown;

    /** Zero-based index of the failing bootstrap step. */
    readonly stepIndex?: number;

    /** Display name of the failing bootstrap step. */
    readonly stepName?: string;
}
