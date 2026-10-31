---
title: 'Class: OtelMetricClient'
generated: true
editUrl: false
---

# Class: OtelMetricClient

Defined in: [libs/platform-telemetry/src/otel/client/OtelMetricClient.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/client/OtelMetricClient.ts#L8)

Owns OpenTelemetry metric instruments and their recording semantics.

## Constructors

### Constructor

```ts
new OtelMetricClient(): OtelMetricClient;
```

#### Returns

`OtelMetricClient`

## Methods

### getInstruments()

```ts
getInstruments(): IMetricInstruments | undefined;
```

Defined in: [libs/platform-telemetry/src/otel/client/OtelMetricClient.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/client/OtelMetricClient.ts#L48)

#### Returns

[`IMetricInstruments`](Interface.IMetricInstruments) \| `undefined`

---

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/otel/client/OtelMetricClient.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/client/OtelMetricClient.ts#L24)

#### Returns

`Promise`\<`void`\>

---

### record()

```ts
record(
   kind,
   name,
   value,
   attributes
): void;
```

Defined in: [libs/platform-telemetry/src/otel/client/OtelMetricClient.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/client/OtelMetricClient.ts#L57)

#### Parameters

| Parameter    | Type                                         |
| ------------ | -------------------------------------------- |
| `kind`       | [`MetricKind`](TypeAlias.MetricKind)         |
| `name`       | `string`                                     |
| `value`      | `number`                                     |
| `attributes` | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`
