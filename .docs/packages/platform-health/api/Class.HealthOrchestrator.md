---
title: 'Class: HealthOrchestrator'
generated: true
editUrl: false
---

# Class: HealthOrchestrator

Defined in: [libs/platform-health/src/HealthOrchestrator.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/HealthOrchestrator.ts#L15)

Orchestrates execution of all registered health indicators and aggregates their results.

## Constructors

### Constructor

```ts
new HealthOrchestrator(): HealthOrchestrator;
```

Defined in: [libs/platform-health/src/HealthOrchestrator.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/HealthOrchestrator.ts#L27)

#### Returns

`HealthOrchestrator`

## Methods

### check()

```ts
check(): Promise<IHealthCheckResult[]>;
```

Defined in: [libs/platform-health/src/HealthOrchestrator.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/HealthOrchestrator.ts#L65)

Executes all registered health indicators and aggregates their results.

#### Returns

`Promise`\<[`IHealthCheckResult`](Interface.IHealthCheckResult)[]\>

The aggregated health check results.

---

### registerIndicator()

```ts
registerIndicator(indicator): void;
```

Defined in: [libs/platform-health/src/HealthOrchestrator.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-health/src/HealthOrchestrator.ts#L41)

Registers a health indicator.

#### Parameters

| Parameter   | Type                                             | Description                       |
| ----------- | ------------------------------------------------ | --------------------------------- |
| `indicator` | [`IHealthIndicator`](Interface.IHealthIndicator) | The health indicator to register. |

#### Returns

`void`
