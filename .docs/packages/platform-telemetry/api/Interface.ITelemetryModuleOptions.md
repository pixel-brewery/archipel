---
title: 'Interface: ITelemetryModuleOptions'
generated: true
editUrl: false
---

# Interface: ITelemetryModuleOptions

Defined in: [libs/platform-telemetry/src/options/TelemetryModuleOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryModuleOptions.ts#L6)

Telemetry SDK options with explicitly selected OpenTelemetry metric readers.

## Extends

- `Partial`\<[`ITelemetryOptions`](Interface.ITelemetryOptions)\>

## Properties

### enabled?

```ts
enabled?: boolean;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L17)

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`enabled`](Interface.ITelemetryOptions#enabled)

---

### environment?

```ts
environment?: string;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L21)

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`environment`](Interface.ITelemetryOptions#environment)

---

### extraInstrumentations?

```ts
extraInstrumentations?: Instrumentation<InstrumentationConfig>[];
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L29)

Host-selected instrumentations registered alongside the built-in selections.

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`extraInstrumentations`](Interface.ITelemetryOptions#extrainstrumentations)

---

### httpMetricsInterceptor?

```ts
httpMetricsInterceptor?: boolean;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryModuleOptions.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryModuleOptions.ts#L10)

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

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`instrumentation`](Interface.ITelemetryOptions#instrumentation)

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

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`interceptor`](Interface.ITelemetryOptions#interceptor)

---

### logCorrelation?

```ts
logCorrelation?: boolean;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L32)

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`logCorrelation`](Interface.ITelemetryOptions#logcorrelation)

---

### metricReaders?

```ts
metricReaders?: MetricReader[];
```

Defined in: [libs/platform-telemetry/src/options/TelemetryModuleOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryModuleOptions.ts#L9)

---

### metrics?

```ts
metrics?: ITelemetryMetricsOptions;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L31)

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`metrics`](Interface.ITelemetryOptions#metrics)

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

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`pattern`](Interface.ITelemetryOptions#pattern)

---

### resourceAttributes?

```ts
resourceAttributes?: Attributes;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L23)

Additional host-owned resource metadata; omit credentials and private data.

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`resourceAttributes`](Interface.ITelemetryOptions#resourceattributes)

---

### resourceDetectors?

```ts
resourceDetectors?: ResourceDetector[];
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L25)

Overrides automatic environment/process/host detection; use [] for explicit metadata only.

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`resourceDetectors`](Interface.ITelemetryOptions#resourcedetectors)

---

### sdk?

```ts
sdk?: IOtelSdk;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryModuleOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryModuleOptions.ts#L8)

Adopts a pre-bootstrap SDK and its shutdown lifecycle instead of starting another provider.

---

### serviceName?

```ts
serviceName?: string;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L18)

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`serviceName`](Interface.ITelemetryOptions#servicename)

---

### serviceVersion?

```ts
serviceVersion?: string;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L20)

Host release version attached to the service resource.

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`serviceVersion`](Interface.ITelemetryOptions#serviceversion)

---

### spanExporter?

```ts
spanExporter?: SpanExporter;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L27)

Explicit host exporter; takes precedence over traces.exporter.

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`spanExporter`](Interface.ITelemetryOptions#spanexporter)

---

### traces?

```ts
traces?: ITelemetryTracesOptions;
```

Defined in: [libs/platform-telemetry/src/options/TelemetryOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/options/TelemetryOptions.ts#L30)

#### Inherited from

[`ITelemetryOptions`](Interface.ITelemetryOptions).[`traces`](Interface.ITelemetryOptions#traces)
