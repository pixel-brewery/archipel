/** Host-owned classification and request correlation for operational diagnostics. */
export interface IDiagnosticsOptions {
    /** Returns bounded, safe attributes; never return messages, SQL, credentials or customer data. */
    readonly classifyFailure?: (error: unknown) => Readonly<Record<string, string>>;
    /** Returns a host-generated correlation ID. IDs are exported to logs only. */
    readonly getCorrelationId?: () => string | undefined;
}
