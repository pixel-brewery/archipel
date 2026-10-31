/** Optional diagnostics adapter for the public PostgreSQL acquisition boundary. No telemetry package is required. */
export interface IPoolObserver {
    complete(operation: 'database_pool_acquire', durationMs: number, outcome: 'success' | 'failure'): void;
    gauge(name: 'database_pool_connections' | 'database_pool_idle' | 'database_pool_waiting' | 'database_pool_max', value: number): void;
    failure(component: 'database', operation: 'pool', error: unknown): void;
}
