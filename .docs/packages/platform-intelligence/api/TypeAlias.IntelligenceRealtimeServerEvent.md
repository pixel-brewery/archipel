---
title: 'Type Alias: IntelligenceRealtimeServerEvent'
generated: true
editUrl: false
---

# Type Alias: IntelligenceRealtimeServerEvent

```ts
type IntelligenceRealtimeServerEvent =
    | {
          delegationMode?: 'client' | 'provider';
          raw: unknown;
          sessionId: string;
          type: 'session-started';
      }
    | {
          raw: unknown;
          reason: string;
          sessionId?: string;
          type: 'session-closed';
          usage: {
              seconds: number;
          };
      }
    | {
          contextWindowUsageRatio?: number;
          raw: unknown;
          type: 'session-usage';
          usage: {
              seconds: number;
          };
      }
    | {
          delta: string;
          raw: unknown;
          type: 'audio-chunk';
      }
    | {
          delta: string;
          endMs: number;
          raw: unknown;
          speaker: 'user' | 'assistant';
          startMs: number;
          type: 'transcript-fragment';
      }
    | {
          delegationId: string;
          offsetMs?: number;
          raw: unknown;
          responseId?: string;
          target?: 'client' | 'provider';
          type: 'delegation-created';
      }
    | {
          clientEventId?: string;
          command: string;
          raw: unknown;
          type: 'command-acknowledged';
      }
    | {
          raw: unknown;
          sessionId?: string;
          type: 'session-created';
      }
    | {
          raw: unknown;
          type: 'session-updated';
      }
    | {
          itemId?: string;
          raw: unknown;
          type: 'speech-started';
      }
    | {
          itemId?: string;
          raw: unknown;
          type: 'speech-stopped';
      }
    | {
          itemId?: string;
          previousItemId?: string;
          raw: unknown;
          type: 'audio-committed';
      }
    | {
          item: unknown;
          itemId: string;
          raw: unknown;
          type: 'conversation-item-added';
      }
    | {
          itemId: string;
          raw: unknown;
          transcript: string;
          type: 'input-transcription-completed';
      }
    | {
          raw: unknown;
          responseId: string;
          type: 'response-created';
      }
    | {
          raw: unknown;
          responseId: string;
          status: string;
          type: 'response-done';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'output-item-added';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'output-item-done';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'content-part-added';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'content-part-done';
      }
    | {
          delta: string;
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'audio-delta';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'audio-done';
      }
    | {
          delta: string;
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'audio-transcript-delta';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          transcript?: string;
          type: 'audio-transcript-done';
      }
    | {
          delta: string;
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'text-delta';
      }
    | {
          itemId: string;
          raw: unknown;
          responseId: string;
          text?: string;
          type: 'text-done';
      }
    | {
          callId: string;
          delta: string;
          itemId: string;
          raw: unknown;
          responseId: string;
          type: 'function-call-arguments-delta';
      }
    | {
          arguments: string;
          callId: string;
          itemId: string;
          name: string;
          raw: unknown;
          responseId: string;
          type: 'function-call-arguments-done';
      }
    | {
          code?: string;
          message: string;
          raw: unknown;
          type: 'error';
      }
    | {
          raw: unknown;
          rawType: string;
          type: 'custom';
      };
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeServerEvent.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeServerEvent.ts#L10)

Provider-neutral event emitted by a realtime model.

The original provider event remains available through `raw` for audited
provider-specific diagnostics without leaking provider contracts into the
normal application flow.
