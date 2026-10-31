---
title: 'Type Alias: IntelligenceJsonValue'
generated: true
editUrl: false
---

# Type Alias: IntelligenceJsonValue

```ts
type IntelligenceJsonValue =
    | string
    | number
    | boolean
    | null
    | ReadonlyArray<IntelligenceJsonValue>
    | {
          [key: string]: IntelligenceJsonValue;
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IntelligenceJsonValue.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IntelligenceJsonValue.ts#L6)

JSON-compatible value used by provider-neutral intelligence contracts.
