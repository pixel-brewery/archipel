/** Lifecycle of the OpenTelemetry components selected by the host application. */
export interface IOtelSdk {
    /**
     * Exports pending telemetry without terminating the SDK.
     * The wait is bounded to 5 seconds unless a positive timeout is supplied.
     * Export failure or expiry rejects; callers decide how to retain/report the work.
     */
    forceFlush(timeoutMillis?: number): Promise<void>;

    /** Stops instrumentation and shuts down the SDK once, with a bounded wait. */
    shutdown(timeoutMillis?: number): Promise<void>;
}
