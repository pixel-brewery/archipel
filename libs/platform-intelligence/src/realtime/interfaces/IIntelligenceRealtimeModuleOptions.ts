// #region Imports

import type { Type } from '@nestjs/common';
import type { IntelligenceRealtimeMeteringBase } from '../abstracts/IntelligenceRealtimeMeteringBase.js';

// #endregion

/**
 * Module-level resilience and resource limits for realtime intelligence.
 *
 * @public
 */
export interface IIntelligenceRealtimeModuleOptions {
    // #region Properties

    /** Application adapter that persists metering and audit events. */
    readonly meteringAdapter?: Type<IntelligenceRealtimeMeteringBase> | IntelligenceRealtimeMeteringBase;

    /** Maximum server-owned WebSockets and concurrent WebRTC negotiations. Defaults to 1,000. */
    readonly maxActiveSessions?: number;

    /** Maximum queued inbound or outbound events per session. Defaults to 512. */
    readonly maxPendingEvents?: number;

    /** Maximum upstream WebSocket buffered bytes. Defaults to 4 MiB. */
    readonly maxBufferedBytes?: number;

    /** Provider token and WebSocket connection timeout, capped at five seconds. */
    readonly connectionTimeoutMs?: number;

    /** Graceful close and total WebRTC termination timeout, capped at five seconds. */
    readonly closeTimeoutMs?: number;

    /** Provider-independent billing interval. Defaults to 30 seconds. */
    readonly meteringIntervalMs?: number;

    /** Transient token request retries, capped at two. */
    readonly tokenRequestMaxRetries?: number;

    /** Transient WebRTC termination request retries within `closeTimeoutMs`, capped at two. Defaults to two. */
    readonly terminationMaxRetries?: number;

    // #endregion
}
