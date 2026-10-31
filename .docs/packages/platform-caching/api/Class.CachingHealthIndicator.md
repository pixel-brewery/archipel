---
title: 'Class: CachingHealthIndicator'
generated: true
editUrl: false
---

# Class: CachingHealthIndicator

Defined in: [libs/platform-caching/src/health/CachingHealthIndicator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/health/CachingHealthIndicator.ts#L15)

Health indicator for the caching layer.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new CachingHealthIndicator(): CachingHealthIndicator;
```

#### Returns

`CachingHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'caching';
```

Defined in: [libs/platform-caching/src/health/CachingHealthIndicator.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/health/CachingHealthIndicator.ts#L18)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): HealthIndicatorResult<string>;
```

Defined in: [libs/platform-caching/src/health/CachingHealthIndicator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/health/CachingHealthIndicator.ts#L30)

Returns the health status of the caching layer.

#### Returns

`HealthIndicatorResult`\<`string`\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
