import type { AnalyticsLevel } from '../models/AnalyticsLevel.js';
import type { IAnalyticsBreadcrumb } from '../models/IAnalyticsBreadcrumb.js';
import type { IAnalyticsUser } from '../models/IAnalyticsUser.js';

/**
 * Abstract base for analytics and error tracking clients.
 * Each provider (Sentry, Application Insights, Datadog) must implement this contract
 * so that the consuming application can switch providers without changing business logic.
 *
 * @public
 */
export abstract class AnalyticsClientBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Capture an exception with optional context.
     *
     * @public
     * @param error - The error to capture.
     * @param context - Optional additional context metadata.
     */
    public abstract captureException(error: Error, context?: Record<string, unknown>): void;

    /**
     * Capture a message with a specific severity level.
     *
     * @public
     * @param message - The message to capture.
     * @param level - Severity level of the message.
     * @param context - Optional additional context metadata.
     */
    public abstract captureMessage(message: string, level: AnalyticsLevel, context?: Record<string, unknown>): void;

    /**
     * Set the current user context for subsequent events.
     *
     * @public
     * @param user - The user context to set.
     */
    public abstract setUser(user: IAnalyticsUser): void;

    /**
     * Clear the current user context.
     *
     * @public
     */
    public abstract clearUser(): void;

    /**
     * Add a breadcrumb entry to the analytics trail.
     *
     * @public
     * @param breadcrumb - The breadcrumb to add.
     */
    public abstract addBreadcrumb(breadcrumb: IAnalyticsBreadcrumb): void;

    /**
     * Lightweight readiness check for the analytics provider.
     * Override in adapters to verify SDK initialization.
     * Defaults to `true` if not overridden.
     *
     * @public
     * @returns `true` if the provider is ready.
     */
    public async ping(): Promise<boolean> {
        return true;
    }

    // #endregion
}
