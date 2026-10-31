---
title: 'Abstract Class: MeasurementSinkBase'
generated: true
editUrl: false
---

# Abstract Class: MeasurementSinkBase

Defined in: [libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts#L2)

Destination for individual numeric measurements.

## Extended by

- [`NoopMeasurementSink`](Class.NoopMeasurementSink)
- [`VercelMeasurementSink`](Class.VercelMeasurementSink)
- [`NewRelicMeasurementSink`](Class.NewRelicMeasurementSink)

## Constructors

### Constructor

```ts
new MeasurementSinkBase(): MeasurementSinkBase;
```

#### Returns

`MeasurementSinkBase`

## Methods

### initialize()

```ts
initialize(): void | Promise<void>;
```

Defined in: [libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts#L16)

#### Returns

`void` \| `Promise`\<`void`\>

---

### record()

```ts
abstract record(
   name,
   value,
   attributes
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/abstracts/MeasurementSinkBase.ts#L14)

#### Parameters

| Parameter    | Type                                         |
| ------------ | -------------------------------------------- |
| `name`       | `string`                                     |
| `value`      | `number`                                     |
| `attributes` | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`
