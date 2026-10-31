/**
 * Represents user context for analytics tracking.
 *
 * @public
 */
export interface IAnalyticsUser {
    /**
     * Unique user identifier.
     */
    readonly id: string;

    /**
     * Optional e-mail address.
     */
    readonly email?: string;

    /**
     * Optional display name.
     */
    readonly username?: string;

    /**
     * Additional user traits.
     */
    readonly traits?: Record<string, unknown>;
}
