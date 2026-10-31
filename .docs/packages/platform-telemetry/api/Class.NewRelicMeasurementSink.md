---
title: 'Class: NewRelicMeasurementSink'
generated: true
editUrl: false
---

# Class: NewRelicMeasurementSink

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts#L37)

Delivers measurements and sanitized operational failure logs to an explicitly selected New Relic region.

## Extends

- [`MeasurementSinkBase`](Class.MeasurementSinkBase)

## Implements

- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new NewRelicMeasurementSink(config, options): NewRelicMeasurementSink;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts#L53)

#### Parameters

| Parameter | Type                                                                   |
| --------- | ---------------------------------------------------------------------- |
| `config`  | `ConfigService`                                                        |
| `options` | [`INewRelicMeasurementOptions`](Interface.INewRelicMeasurementOptions) |

#### Returns

`NewRelicMeasurementSink`

#### Overrides

[`MeasurementSinkBase`](Class.MeasurementSinkBase).[`constructor`](Class.MeasurementSinkBase#constructor)

## Methods

### initialize()

```ts
initialize(): void | Promise<void>;
```

Defined in: [libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts#L16)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`MeasurementSinkBase`](Class.MeasurementSinkBase).[`initialize`](Class.MeasurementSinkBase#initialize)

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts:120](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts#L120)

Drains pending delivery for at most five seconds, then aborts in-flight requests.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### record()

```ts
record(
   name,
   value,
   attributes
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementSink.ts#L69)

#### Parameters

| Parameter    | Type                                         |
| ------------ | -------------------------------------------- |
| `name`       | `string`                                     |
| `value`      | `number`                                     |
| `attributes` | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`

#### Overrides

[`MeasurementSinkBase`](Class.MeasurementSinkBase).[`record`](Class.MeasurementSinkBase#record)
