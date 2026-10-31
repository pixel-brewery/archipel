/**
 * Represents the result of a health check indicator.
 *
 * @public
 */
export interface IHealthCheckResult {
    /**
     * The name of the health indicator (e.g., 'database', 'app').
     */
    name: string;

    /**
     * The status of the health indicator ('up', 'down').
     */
    status: 'up' | 'down';

    /**
     * Optional additional details about the health check.
     */
    details?: Record<string, unknown>;
}
