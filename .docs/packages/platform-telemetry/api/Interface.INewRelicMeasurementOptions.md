---
title: 'Interface: INewRelicMeasurementOptions'
generated: true
editUrl: false
---

# Interface: INewRelicMeasurementOptions

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts#L2)

Explicit New Relic destination and host lifecycle integration.

## Properties

### attributes

```ts
readonly attributes: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts#L6)

Stable resource attributes such as service.name and deployment.environment. Never include secrets or record IDs.

---

### durationEvents?

```ts
readonly durationEvents?: boolean;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts#L10)

Export each individual duration as a MeasurementDuration event, enabling real percentiles. Disabled by default.

---

### region

```ts
readonly region: "eu" | "us";
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts#L4)

Select the account's ingest region. There is no implicit region fallback.

---

### retain?

```ts
readonly retain?: (delivery) => void;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts#L12)

Optional host hook (for example waitUntil) retaining the asynchronous export after a response.

#### Parameters

| Parameter  | Type                |
| ---------- | ------------------- |
| `delivery` | `Promise`\<`void`\> |

#### Returns

`void`

---

### serviceVersion?

```ts
readonly serviceVersion?: string;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/NewRelicMeasurementOptions.ts#L8)

Build identity attached to operational failure logs.
