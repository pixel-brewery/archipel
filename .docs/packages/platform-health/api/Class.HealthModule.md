---
title: 'Class: HealthModule'
generated: true
editUrl: false
---

# Class: HealthModule

Defined in: [libs/platform-health/src/HealthModule.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/HealthModule.ts#L15)

## Constructors

### Constructor

```ts
new HealthModule(): HealthModule;
```

#### Returns

`HealthModule`

## Methods

### withIndicators()

```ts
static withIndicators(indicators): DynamicModule;
```

Defined in: [libs/platform-health/src/HealthModule.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/HealthModule.ts#L21)

Registers additional health indicators.

#### Parameters

| Parameter    | Type                                                         | Description                                              |
| ------------ | ------------------------------------------------------------ | -------------------------------------------------------- |
| `indicators` | `Type`\<[`IHealthIndicator`](Interface.IHealthIndicator)\>[] | Array of indicator classes implementing IHealthIndicator |

#### Returns

`DynamicModule`
