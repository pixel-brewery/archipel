---
title: 'Class: VercelMeasurementSink'
generated: true
editUrl: false
---

# Class: VercelMeasurementSink

Defined in: [libs/platform-telemetry/src/measurements/providers/vercel/VercelMeasurementSink.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/vercel/VercelMeasurementSink.ts#L8)

Sends each observation to Vercel Custom Metrics for the current Function invocation.

## Extends

- [`MeasurementSinkBase`](Class.MeasurementSinkBase)

## Constructors

### Constructor

```ts
new VercelMeasurementSink(): VercelMeasurementSink;
```

#### Returns

`VercelMeasurementSink`

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
   name,
   value,
   attributes
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/vercel/VercelMeasurementSink.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/vercel/VercelMeasurementSink.ts#L20)

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
