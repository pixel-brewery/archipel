---
title: 'Interface: ITelemetryOptions'
generated: true
editUrl: false
---

# Interface: ITelemetryOptions

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L16)

## Properties

### enabled

```ts
enabled: boolean;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L17)

---

### environment?

```ts
environment?: string;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L21)

---

### extraInstrumentations?

```ts
extraInstrumentations?: Instrumentation<InstrumentationConfig>[];
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L29)

Host-selected instrumentations registered alongside the built-in selections.

---

### instrumentation?

```ts
instrumentation?: {
  express?: boolean;
  http?: boolean;
};
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L33)

#### express?

```ts
express?: boolean;
```

#### http?

```ts
http?: boolean;
```

---

### interceptor?

```ts
interceptor?: {
  operation?: boolean;
};
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L41)

#### operation?

```ts
operation?: boolean;
```

---

### logCorrelation?

```ts
logCorrelation?: boolean;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L32)

---

### metrics?

```ts
metrics?: ITelemetryMetricsOptions;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L31)

---

### pattern?

```ts
pattern?: {
  enableCacheMetrics?: boolean;
  enableOperationMetrics?: boolean;
};
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L37)

#### enableCacheMetrics?

```ts
enableCacheMetrics?: boolean;
```

#### enableOperationMetrics?

```ts
enableOperationMetrics?: boolean;
```

---

### resourceAttributes?

```ts
resourceAttributes?: Attributes;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L23)

Additional host-owned resource metadata; omit credentials and private data.

---

### resourceDetectors?

```ts
resourceDetectors?: ResourceDetector[];
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L25)

Overrides automatic environment/process/host detection; use [] for explicit metadata only.

---

### serviceName

```ts
serviceName: string;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L18)

---

### serviceVersion?

```ts
serviceVersion?: string;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L20)

Host release version attached to the service resource.

---

### spanExporter?

```ts
spanExporter?: SpanExporter;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L27)

Explicit host exporter; takes precedence over traces.exporter.

---

### traces?

```ts
traces?: ITelemetryTracesOptions;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L30)
