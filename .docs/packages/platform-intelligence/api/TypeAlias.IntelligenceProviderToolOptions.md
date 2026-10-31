---
title: 'Type Alias: IntelligenceProviderToolOptions'
generated: true
editUrl: false
---

# Type Alias: IntelligenceProviderToolOptions

```ts
type IntelligenceProviderToolOptions = Readonly<Record<string, unknown>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IntelligenceProviderToolOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IntelligenceProviderToolOptions.ts#L9)

Opaque provider-tool configuration accepted only by provider-specific subpaths.

Applications keep the options object inside Archipel while the provider
adapter validates its exact shape at runtime.
