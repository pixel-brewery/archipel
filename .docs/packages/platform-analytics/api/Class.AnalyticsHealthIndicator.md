---
title: 'Class: AnalyticsHealthIndicator'
generated: true
editUrl: false
---

# Class: AnalyticsHealthIndicator

Defined in: [libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts#L17)

Health indicator for the analytics infrastructure.
Calls [AnalyticsClientBase.ping](Class.AnalyticsClientBase#ping) to verify provider readiness.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new AnalyticsHealthIndicator(analyticsClient?): AnalyticsHealthIndicator;
```

Defined in: [libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts#L27)

#### Parameters

| Parameter          | Type                                               |
| ------------------ | -------------------------------------------------- |
| `analyticsClient?` | [`AnalyticsClientBase`](Class.AnalyticsClientBase) |

#### Returns

`AnalyticsHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'analytics';
```

Defined in: [libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts#L35)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<HealthIndicatorResult<string>>;
```

Defined in: [libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/health/AnalyticsHealthIndicator.ts#L48)

Pings the analytics provider to verify readiness.
Returns disabled status when no client is configured.

#### Returns

`Promise`\<`HealthIndicatorResult`\<`string`\>\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
