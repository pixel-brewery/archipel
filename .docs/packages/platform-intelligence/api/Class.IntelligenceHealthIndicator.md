---
title: 'Class: IntelligenceHealthIndicator'
generated: true
editUrl: false
---

# Class: IntelligenceHealthIndicator

Defined in: [libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts#L21)

Health indicator for the intelligence infrastructure.
Performs a bounded remote readiness probe for the default language model and
reports the locally registered capability topology.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new IntelligenceHealthIndicator(
   providerRegistry?,
   diagnostics?,
   realtimeSessionFactory?
): IntelligenceHealthIndicator;
```

Defined in: [libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts#L34)

#### Parameters

| Parameter                 | Type                                                                             |
| ------------------------- | -------------------------------------------------------------------------------- |
| `providerRegistry?`       | [`IntelligenceProviderRegistry`](Class.IntelligenceProviderRegistry)             |
| `diagnostics?`            | [`IntelligenceProviderDiagnostics`](Class.IntelligenceProviderDiagnostics)       |
| `realtimeSessionFactory?` | [`IntelligenceRealtimeSessionFactory`](Class.IntelligenceRealtimeSessionFactory) |

#### Returns

`IntelligenceHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'intelligence';
```

Defined in: [libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts#L48)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<HealthIndicatorResult<string>>;
```

Defined in: [libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/health/IntelligenceHealthIndicator.ts#L61)

Verifies that the provider configuration can be resolved.
Returns disabled status when no intelligence generator is configured.

#### Returns

`Promise`\<`HealthIndicatorResult`\<`string`\>\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
