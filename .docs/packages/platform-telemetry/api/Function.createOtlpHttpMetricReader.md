---
title: 'Function: createOtlpHttpMetricReader()'
generated: true
editUrl: false
---

# Function: createOtlpHttpMetricReader()

```ts
function createOtlpHttpMetricReader(options?): PeriodicExportingMetricReader;
```

Defined in: [libs/platform-telemetry/src/otel/providers/otlp-http/createOtlpHttpMetricReader.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/providers/otlp-http/createOtlpHttpMetricReader.ts#L6)

Creates an OTLP/HTTP reader using the standard OpenTelemetry exporter configuration.

## Parameters

| Parameter  | Type                                                     |
| ---------- | -------------------------------------------------------- |
| `options?` | [`IMetricReaderOptions`](Interface.IMetricReaderOptions) |

## Returns

`PeriodicExportingMetricReader`
