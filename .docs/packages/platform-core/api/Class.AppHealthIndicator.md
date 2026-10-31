---
title: 'Class: AppHealthIndicator'
generated: true
editUrl: false
---

# Class: AppHealthIndicator

Defined in: [libs/platform-core/src/terminus/AppHealthIndicator.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/terminus/AppHealthIndicator.ts#L16)

Health indicator for the application.

## Constructors

### Constructor

```ts
new AppHealthIndicator(configService): AppHealthIndicator;
```

Defined in: [libs/platform-core/src/terminus/AppHealthIndicator.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/terminus/AppHealthIndicator.ts#L30)

Constructs a new instance of the `AppHealthIndicator` class.

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`AppHealthIndicator`

## Methods

### isHealthy()

```ts
isHealthy(): HealthIndicatorResult<"app">;
```

Defined in: [libs/platform-core/src/terminus/AppHealthIndicator.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/terminus/AppHealthIndicator.ts#L44)

Checks if the Open Food Facts API is reachable.

#### Returns

`HealthIndicatorResult`\<`"app"`\>

The health indicator result.
