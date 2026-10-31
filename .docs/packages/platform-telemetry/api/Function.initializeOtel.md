---
title: 'Function: initializeOtel()'
generated: true
editUrl: false
---

# Function: initializeOtel()

```ts
function initializeOtel(options, metricReaders?): Promise<IOtelInitResult>;
```

Defined in: [libs/platform-telemetry/src/bootstrap/OtelInitializer.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/bootstrap/OtelInitializer.ts#L16)

Registers only the OpenTelemetry components selected by the application.
Import through the lightweight bootstrap entry point before loading the application
and modules that the selected instrumentations need to patch.

## Parameters

| Parameter        | Type                                               | Default value |
| ---------------- | -------------------------------------------------- | ------------- |
| `options`        | [`ITelemetryOptions`](Interface.ITelemetryOptions) | `undefined`   |
| `metricReaders?` | `MetricReader`[]                                   | `[]`          |

## Returns

`Promise`\<[`IOtelInitResult`](Interface.IOtelInitResult)\>
