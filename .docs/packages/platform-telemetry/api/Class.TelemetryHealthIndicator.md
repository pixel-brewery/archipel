---
title: 'Class: TelemetryHealthIndicator'
generated: true
editUrl: false
---

# Class: TelemetryHealthIndicator

Defined in: [libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts#L17)

Health indicator for the telemetry infrastructure.
Checks whether the OpenTelemetry SDK has been initialized via [OtelSdkHolder](Class.OtelSdkHolder).

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new TelemetryHealthIndicator(sdkHolder?): TelemetryHealthIndicator;
```

Defined in: [libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts#L26)

#### Parameters

| Parameter    | Type                                   |
| ------------ | -------------------------------------- |
| `sdkHolder?` | [`OtelSdkHolder`](Class.OtelSdkHolder) |

#### Returns

`TelemetryHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'telemetry';
```

Defined in: [libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts#L34)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): HealthIndicatorResult<string>;
```

Defined in: [libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/health/TelemetryHealthIndicator.ts#L47)

Checks whether the OpenTelemetry SDK has been initialized.
Returns disabled status when no SDK holder is configured.

#### Returns

`HealthIndicatorResult`\<`string`\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
