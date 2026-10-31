---
title: 'Type Alias: IntelligenceToolOutput'
generated: true
editUrl: false
---

# Type Alias: IntelligenceToolOutput

```ts
type IntelligenceToolOutput =
    | {
          output: unknown;
          type: 'tool-result';
      }
    | {
          error: unknown;
          type: 'tool-error';
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IntelligenceToolOutput.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IntelligenceToolOutput.ts#L6)

Provider-neutral tool result.
