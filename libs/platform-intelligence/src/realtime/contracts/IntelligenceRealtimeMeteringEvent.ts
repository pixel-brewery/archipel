// #region Imports

import type { IIntelligenceRealtimeUsage } from './IIntelligenceRealtimeUsage.js';
import type { IntelligenceRealtimeMetadataValue } from './IntelligenceRealtimeMetadataValue.js';

// #endregion

/**
 * Common envelope for realtime metering and audit events.
 *
 * @public
 */
interface IIntelligenceRealtimeMeteringEnvelope {
    // #region Properties

    /** Stable event identifier suitable for idempotent persistence. */
    readonly eventId: string;

    /** Application-owned logical session identifier. */
    readonly sessionId: string;

    /** Unique identifier for one upstream provider connection. */
    readonly connectionId: string;

    readonly provider: string;
    readonly model: string;
    readonly occurredAt: string;
    readonly metadata: Readonly<Record<string, IntelligenceRealtimeMetadataValue>>;

    // #endregion
}

/**
 * Durable metering event emitted by an Archipel realtime session.
 *
 * `billing-interval` events provide a provider-independent 30-second billing
 * basis by default. `provider-usage` carries exact token dimensions whenever
 * the upstream provider exposes them. Consumers can persist both in one audit
 * transaction and choose their commercial charging strategy independently.
 *
 * @public
 */
export type IntelligenceRealtimeMeteringEvent =
    | (IIntelligenceRealtimeMeteringEnvelope & {
          readonly type: 'session-started';
          readonly startedAt: string;
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          readonly type: 'billing-interval';
          readonly sequence: number;
          readonly periodStartedAt: string;
          readonly periodEndedAt: string;
          readonly durationMs: number;
          readonly final: boolean;
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          readonly type: 'provider-usage';
          readonly responseId: string | null;
          readonly usage: IIntelligenceRealtimeUsage;
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          /** Cumulative provider-reported conversation duration, not a delta. */
          readonly type: 'provider-duration';
          readonly durationSeconds: number;
          readonly final: boolean;
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          readonly type: 'session-ended';
          readonly startedAt: string;
          readonly endedAt: string;
          readonly durationMs: number;
          readonly closeCode: number;
          readonly closeReason: string;
      });
