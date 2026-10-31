/**
 * Internal normalized realtime runtime limits.
 *
 * @internal
 */
export interface IIntelligenceRealtimeRuntimeOptions {
    // #region Properties

    readonly maxActiveSessions: number;
    readonly maxPendingEvents: number;
    readonly maxBufferedBytes: number;
    readonly connectionTimeoutMs: number;
    readonly closeTimeoutMs: number;
    readonly meteringIntervalMs: number;
    readonly tokenRequestMaxRetries: number;
    readonly terminationMaxRetries: number;

    // #endregion
}
