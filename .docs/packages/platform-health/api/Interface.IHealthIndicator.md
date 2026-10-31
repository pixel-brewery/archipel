---
title: 'Interface: IHealthIndicator'
generated: true
editUrl: false
---

# Interface: IHealthIndicator

Defined in: [libs/platform-health/src/IHealthIndicator.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthIndicator.ts#L12)

Defines the contract for a health indicator that can be orchestrated.

## Properties

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-health/src/IHealthIndicator.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthIndicator.ts#L14)

Unique key identifying the indicator

## Methods

### check()

```ts
check():
  | HealthIndicatorResult<string>
| Promise<HealthIndicatorResult<string>>;
```

Defined in: [libs/platform-health/src/IHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/IHealthIndicator.ts#L17)

Performs the health check and returns a result keyed by the indicator key

#### Returns

\| `HealthIndicatorResult`\<`string`\>
\| `Promise`\<`HealthIndicatorResult`\<`string`\>\>
