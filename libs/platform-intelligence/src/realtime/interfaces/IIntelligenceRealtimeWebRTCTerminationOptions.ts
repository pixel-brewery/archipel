/**
 * Identifies one browser-owned WebRTC session that the server ends at its provider.
 *
 * Pass the identifiers of the `IIntelligenceRealtimeWebRTCSessionResult`
 * returned by `createSession()` unchanged; the application must persist them
 * server-side for as long as the browser connection can exist.
 *
 * @public
 */
export interface IIntelligenceRealtimeWebRTCTerminationOptions {
    // #region Properties

    /** Correlation identifier included in structured Archipel logs. */
    readonly requestId?: string;

    /** Application-owned session identifier used for log and error correlation. */
    readonly sessionId: string;

    /** Provider that created the session, as returned by `createSession()`. */
    readonly provider: string;

    /**
     * Model that created the session, as returned by `createSession()`.
     *
     * A provider can serve several realtime APIs with separate session
     * namespaces, and the model selects the API that owns the session. There
     * is deliberately no default model: after a default change, the request
     * would reach an API that reports the session as unknown while the session
     * keeps running.
     */
    readonly model: string;

    /** Provider session identifier returned as `providerSessionId` by `createSession()`. */
    readonly providerSessionId: string;

    /**
     * Non-sensitive reason recorded in Archipel logs, such as `lease-expired`,
     * `client-disconnected`, or `session-completed`. It is not sent to the provider.
     */
    readonly reason?: string;

    // #endregion
}
