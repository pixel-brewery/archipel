/** Explicit New Relic destination and host lifecycle integration. */
export interface INewRelicMeasurementOptions {
    /** Select the account's ingest region. There is no implicit region fallback. */
    readonly region: 'eu' | 'us';
    /** Stable resource attributes such as service.name and deployment.environment. Never include secrets or record IDs. */
    readonly attributes: Readonly<Record<string, string>>;
    /** Build identity attached to operational failure logs. */
    readonly serviceVersion?: string;
    /** Export each individual duration as a MeasurementDuration event, enabling real percentiles. Disabled by default. */
    readonly durationEvents?: boolean;
    /** Optional host hook (for example waitUntil) retaining the asynchronous export after a response. */
    readonly retain?: (delivery: Promise<void>) => void;
}
