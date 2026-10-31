---
title: 'Type Alias: IntelligenceRealtimeClientEvent'
generated: true
editUrl: false
---

# Type Alias: IntelligenceRealtimeClientEvent

```ts
type IntelligenceRealtimeClientEvent =
    | {
          config: IIntelligenceRealtimeSessionConfiguration;
          type: 'session-update';
      }
    | {
          config: IIntelligenceRealtimeSessionConfiguration;
          type: 'session-start';
      }
    | {
          type: 'session-close';
      }
    | {
          type: 'input-audio-mute';
      }
    | {
          type: 'input-audio-unmute';
      }
    | {
          content: string;
          delegationId: string | null;
          providerOptions?: Readonly<Record<string, unknown>>;
          type: 'context-append';
      }
    | {
          audio: string;
          type: 'input-audio-append';
      }
    | {
          type: 'input-audio-commit';
      }
    | {
          type: 'input-audio-clear';
      }
    | {
          item:
              | {
                    role: 'user';
                    text: string;
                    type: 'text-message';
                }
              | {
                    audio: string;
                    role: 'user';
                    type: 'audio-message';
                }
              | {
                    callId: string;
                    name?: string;
                    output: string;
                    type: 'function-call-output';
                };
          type: 'conversation-item-create';
      }
    | {
          audioEndMs: number;
          contentIndex: number;
          itemId: string;
          type: 'conversation-item-truncate';
      }
    | {
          options?: {
              instructions?: string;
              metadata?: Readonly<Record<string, unknown>>;
              modalities?: ReadonlyArray<string>;
          };
          type: 'response-create';
      }
    | {
          type: 'response-cancel';
      };
```

Defined in: [libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeClientEvent.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/contracts/IntelligenceRealtimeClientEvent.ts#L12)

Provider-neutral event sent from an application to a realtime model.
