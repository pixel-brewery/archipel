---
title: 'Class: TelemetryRuleEngine'
generated: true
editUrl: false
---

# Class: TelemetryRuleEngine

Defined in: [libs/platform-telemetry/src/rules/TelemetryRuleEngine.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/rules/TelemetryRuleEngine.ts#L5)

## Constructors

### Constructor

```ts
new TelemetryRuleEngine(options, metricsService?): TelemetryRuleEngine;
```

Defined in: [libs/platform-telemetry/src/rules/TelemetryRuleEngine.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/rules/TelemetryRuleEngine.ts#L13)

#### Parameters

| Parameter         | Type                                               |
| ----------------- | -------------------------------------------------- |
| `options`         | [`ITelemetryOptions`](Interface.ITelemetryOptions) |
| `metricsService?` | [`MetricsService`](Class.MetricsService)           |

#### Returns

`TelemetryRuleEngine`

## Methods

### process()

```ts
process(message): void;
```

Defined in: [libs/platform-telemetry/src/rules/TelemetryRuleEngine.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/rules/TelemetryRuleEngine.ts#L20)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `message` | `string` |

#### Returns

`void`
