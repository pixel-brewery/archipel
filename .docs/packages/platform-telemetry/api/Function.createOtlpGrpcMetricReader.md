---
title: 'Function: createOtlpGrpcMetricReader()'
generated: true
editUrl: false
---

# Function: createOtlpGrpcMetricReader()

```ts
function createOtlpGrpcMetricReader(options?): PeriodicExportingMetricReader;
```

Defined in: [libs/platform-telemetry/src/otel/providers/otlp-grpc/createOtlpGrpcMetricReader.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/providers/otlp-grpc/createOtlpGrpcMetricReader.ts#L6)

Creates an OTLP/gRPC reader using the standard OpenTelemetry exporter configuration.

## Parameters

| Parameter  | Type                                                     |
| ---------- | -------------------------------------------------------- |
| `options?` | [`IMetricReaderOptions`](Interface.IMetricReaderOptions) |

## Returns

`PeriodicExportingMetricReader`
