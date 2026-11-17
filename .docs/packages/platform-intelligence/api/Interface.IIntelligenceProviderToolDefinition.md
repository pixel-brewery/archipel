---
title: 'Interface: IIntelligenceProviderToolDefinition'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderToolDefinition

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderToolDefinition.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderToolDefinition.ts#L8)

Opaque provider-native tool created by a provider `/tools` subpath factory.

Pass it unchanged through `providerTools`; its native definition is meaningful only to the owning provider.

## Properties

### kind

```ts
readonly kind: "provider-tool";
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderToolDefinition.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderToolDefinition.ts#L9)

---

### nativeDefinition

```ts
readonly nativeDefinition: unknown;
```

Defined in: [libs/platform-intelligence/src/providers/IIntelligenceProviderToolDefinition.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/IIntelligenceProviderToolDefinition.ts#L10)
