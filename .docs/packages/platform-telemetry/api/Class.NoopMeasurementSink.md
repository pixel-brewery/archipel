---
title: 'Class: NoopMeasurementSink'
generated: true
editUrl: false
---

# Class: NoopMeasurementSink

Defined in: [libs/platform-telemetry/src/measurements/providers/empty/NoopMeasurementSink.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/empty/NoopMeasurementSink.ts#L6)

Explicit no-op sink for individual numeric measurements.

## Extends

- [`MeasurementSinkBase`](Class.MeasurementSinkBase)

## Constructors

### Constructor

```ts
new NoopMeasurementSink(): NoopMeasurementSink;
```

#### Returns

`NoopMeasurementSink`

#### Inherited from

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

### record()

```ts
record(
   _name,
   _value,
   _attributes
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/empty/NoopMeasurementSink.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/empty/NoopMeasurementSink.ts#L18)

#### Parameters

| Parameter     | Type                                         |
| ------------- | -------------------------------------------- |
| `_name`       | `string`                                     |
| `_value`      | `number`                                     |
| `_attributes` | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`

#### Overrides

[`MeasurementSinkBase`](Class.MeasurementSinkBase).[`record`](Class.MeasurementSinkBase#record)
