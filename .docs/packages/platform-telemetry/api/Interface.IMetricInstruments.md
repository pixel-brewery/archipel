---
title: 'Interface: IMetricInstruments'
generated: true
editUrl: false
---

# Interface: IMetricInstruments

Defined in: [libs/platform-telemetry/src/otel/MetricInstruments.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricInstruments.ts#L4)

Built-in OpenTelemetry instruments used by telemetry operations.

## Properties

### cacheCounter?

```ts
cacheCounter?: Counter<Attributes>;
```

Defined in: [libs/platform-telemetry/src/otel/MetricInstruments.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricInstruments.ts#L5)

---

### opCounter?

```ts
opCounter?: Counter<Attributes>;
```

Defined in: [libs/platform-telemetry/src/otel/MetricInstruments.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricInstruments.ts#L6)

---

### opDuration?

```ts
opDuration?: Histogram<Attributes>;
```

Defined in: [libs/platform-telemetry/src/otel/MetricInstruments.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricInstruments.ts#L7)
