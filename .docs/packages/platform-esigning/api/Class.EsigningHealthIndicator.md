---
title: 'Class: EsigningHealthIndicator'
generated: true
editUrl: false
---

# Class: EsigningHealthIndicator

Defined in: [libs/platform-esigning/src/health/EsigningHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/health/EsigningHealthIndicator.ts#L17)

Health indicator for the e-signing infrastructure.
Calls [EsigningClientBase.ping](Class.EsigningClientBase#ping) to verify provider connectivity.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new EsigningHealthIndicator(esigningClient?): EsigningHealthIndicator;
```

Defined in: [libs/platform-esigning/src/health/EsigningHealthIndicator.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/health/EsigningHealthIndicator.ts#L27)

#### Parameters

| Parameter         | Type                                             |
| ----------------- | ------------------------------------------------ |
| `esigningClient?` | [`EsigningClientBase`](Class.EsigningClientBase) |

#### Returns

`EsigningHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'esigning';
```

Defined in: [libs/platform-esigning/src/health/EsigningHealthIndicator.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/health/EsigningHealthIndicator.ts#L35)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<HealthIndicatorResult<string>>;
```

Defined in: [libs/platform-esigning/src/health/EsigningHealthIndicator.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/health/EsigningHealthIndicator.ts#L48)

Pings the e-signing provider to verify connectivity.
Returns disabled status when no client is configured.

#### Returns

`Promise`\<`HealthIndicatorResult`\<`string`\>\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
