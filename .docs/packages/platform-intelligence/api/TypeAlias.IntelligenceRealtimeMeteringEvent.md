---
title: 'Type Alias: IntelligenceRealtimeMeteringEvent'
generated: true
editUrl: false
---

# Type Alias: IntelligenceRealtimeMeteringEvent

```ts
type IntelligenceRealtimeMeteringEvent =
    | (IIntelligenceRealtimeMeteringEnvelope & {
          startedAt: string;
          type: 'session-started';
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          durationMs: number;
          final: boolean;
          periodEndedAt: string;
          periodStartedAt: string;
          sequence: number;
          type: 'billing-interval';
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          responseId: string | null;
          type: 'provider-usage';
          usage: IIntelligenceRealtimeUsage;
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          durationSeconds: number;
          final: boolean;
          type: 'provider-duration';
      })
    | (IIntelligenceRealtimeMeteringEnvelope & {
          closeCode: number;
          closeReason: string;
          durationMs: number;
          endedAt: string;
          startedAt: string;
          type: 'session-ended';
      });
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeMeteringEvent.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeMeteringEvent.ts#L43)

Durable metering event emitted by an Archipel realtime session.

`billing-interval` events provide a provider-independent 30-second billing
basis by default. `provider-usage` carries exact token dimensions whenever
the upstream provider exposes them. Consumers can persist both in one audit
transaction and choose their commercial charging strategy independently.
