---
title: 'Type Alias: IntelligenceLanguageStreamPart'
generated: true
editUrl: false
---

# Type Alias: IntelligenceLanguageStreamPart

```ts
type IntelligenceLanguageStreamPart =
    | {
          text: string;
          type: 'text-delta';
      }
    | {
          input: unknown;
          toolCallId: string;
          toolName: string;
          type: 'tool-call';
      }
    | {
          output: unknown;
          toolCallId: string;
          toolName: string;
          type: 'tool-result';
      }
    | {
          phase: 'start' | 'finish';
          type: 'step';
      }
    | {
          error: unknown;
          type: 'error';
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IntelligenceLanguageStreamPart.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IntelligenceLanguageStreamPart.ts#L2)

Provider-neutral text and tool events, including tools executed by a client.
