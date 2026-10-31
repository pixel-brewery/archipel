---
title: 'Type Alias: IntelligenceToolChoice'
generated: true
editUrl: false
---

# Type Alias: IntelligenceToolChoice

```ts
type IntelligenceToolChoice =
    | 'auto'
    | 'none'
    | 'required'
    | {
          toolName: string;
          type: 'tool';
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IntelligenceToolChoice.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IntelligenceToolChoice.ts#L6)

Provider-neutral tool-selection policy.
