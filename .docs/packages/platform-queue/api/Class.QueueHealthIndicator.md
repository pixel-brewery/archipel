---
title: 'Class: QueueHealthIndicator'
generated: true
editUrl: false
---

# Class: QueueHealthIndicator

Defined in: [libs/platform-queue/src/health/QueueHealthIndicator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/health/QueueHealthIndicator.ts#L15)

Health indicator for the queue infrastructure.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new QueueHealthIndicator(): QueueHealthIndicator;
```

#### Returns

`QueueHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'queue';
```

Defined in: [libs/platform-queue/src/health/QueueHealthIndicator.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/health/QueueHealthIndicator.ts#L18)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): HealthIndicatorResult<string>;
```

Defined in: [libs/platform-queue/src/health/QueueHealthIndicator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/health/QueueHealthIndicator.ts#L30)

Returns the health status of the queue infrastructure.

#### Returns

`HealthIndicatorResult`\<`string`\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
