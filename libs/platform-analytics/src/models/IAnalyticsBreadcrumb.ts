/**
 * Represents a breadcrumb entry for analytics trail.
 *
 * @public
 */
export interface IAnalyticsBreadcrumb {
    /**
     * Category of the breadcrumb (e.g. `http`, `navigation`, `user`).
     */
    readonly category: string;

    /**
     * Human-readable message.
     */
    readonly message: string;

    /**
     * Severity level.
     */
    readonly level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';

    /**
     * Additional metadata.
     */
    readonly data?: Record<string, unknown>;
}
