---
title: 'Class: IntelligenceProviderRegistry'
generated: true
editUrl: false
---

# Class: IntelligenceProviderRegistry

Defined in: [libs/platform-intelligence/src/IntelligenceProviderRegistry.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderRegistry.ts#L17)

Immutable registry of provider adapters and their supported capabilities.

## Constructors

### Constructor

```ts
new IntelligenceProviderRegistry(adapters): IntelligenceProviderRegistry;
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderRegistry.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderRegistry.ts#L27)

#### Parameters

| Parameter  | Type                                                                                  |
| ---------- | ------------------------------------------------------------------------------------- |
| `adapters` | readonly [`IntelligenceProviderAdapterBase`](Class.IntelligenceProviderAdapterBase)[] |

#### Returns

`IntelligenceProviderRegistry`

## Methods

### listProviders()

```ts
listProviders(): readonly string[];
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderRegistry.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderRegistry.ts#L64)

Returns all registered provider identifiers.

#### Returns

readonly `string`[]

---

### listProvidersFor()

```ts
listProvidersFor(capability): readonly string[];
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderRegistry.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderRegistry.ts#L73)

Returns providers supporting one capability.

#### Parameters

| Parameter    | Type                                                         |
| ------------ | ------------------------------------------------------------ |
| `capability` | [`IntelligenceCapability`](TypeAlias.IntelligenceCapability) |

#### Returns

readonly `string`[]
