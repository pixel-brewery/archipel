---
title: 'Function: createPrometheusMetricReader()'
generated: true
editUrl: false
---

# Function: createPrometheusMetricReader()

```ts
function createPrometheusMetricReader(port?): PrometheusExporter;
```

Defined in: [libs/platform-telemetry/src/otel/providers/prometheus/createPrometheusMetricReader.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/providers/prometheus/createPrometheusMetricReader.ts#L4)

Creates an OpenTelemetry scrape reader for long-running Prometheus targets.

## Parameters

| Parameter | Type     |
| --------- | -------- |
| `port?`   | `number` |

## Returns

`PrometheusExporter`
