---
title: 'Type Alias: IIntelligenceModelMessage'
generated: true
editUrl: false
---

# Type Alias: IIntelligenceModelMessage

```ts
type IIntelligenceModelMessage =
    | {
          content:
              | string
              | ReadonlyArray<
                    | {
                          input: IntelligenceJsonValue;
                          toolCallId: string;
                          toolName: string;
                          type: 'tool-call';
                      }
                    | {
                          text: string;
                          type: 'text';
                      }
                    | {
                          image: string | URL | Uint8Array | ArrayBuffer;
                          mediaType?: string;
                          type: 'image';
                      }
                    | {
                          data: string | URL | Uint8Array | ArrayBuffer;
                          filename?: string;
                          mediaType: string;
                          type: 'file';
                      }
                >;
          role: 'system' | 'developer' | 'user' | 'assistant';
      }
    | {
          content: ReadonlyArray<{
              output: IntelligenceJsonValue;
              toolCallId: string;
              toolName: string;
              type: 'tool-result';
          }>;
          role: 'tool';
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelMessage.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelMessage.ts#L12)

Provider-neutral conversation message.
