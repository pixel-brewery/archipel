---
title: 'Class: DiagnosticsService'
generated: true
editUrl: false
---

# Class: DiagnosticsService

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsService.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsService.ts#L8)

Records dependency outcomes and sanitized failures through the selected measurement sink.

## Constructors

### Constructor

```ts
new DiagnosticsService(measurements, options): DiagnosticsService;
```

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsService.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsService.ts#L19)

#### Parameters

| Parameter      | Type                                                   |
| -------------- | ------------------------------------------------------ |
| `measurements` | [`MeasurementsService`](Class.MeasurementsService)     |
| `options`      | [`IDiagnosticsOptions`](Interface.IDiagnosticsOptions) |

#### Returns

`DiagnosticsService`

## Methods

### complete()

```ts
complete(
   operation,
   durationMs,
   outcome,
   context?
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsService.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsService.ts#L32)

Records one outcome and its duration. Use stable operation names and bounded context values.

#### Parameters

| Parameter    | Type                                         |
| ------------ | -------------------------------------------- |
| `operation`  | `string`                                     |
| `durationMs` | `number`                                     |
| `outcome`    | `"success"` \| `"failure"` \| `"skipped"`    |
| `context?`   | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`

---

### failure()

```ts
failure(
   component,
   operation,
   error,
   context?,
   options?
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsService.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsService.ts#L47)

Records a failure without serializing the thrown value. Background work can suppress request correlation.
Classification and correlation callbacks are best effort and cannot replace the application failure.

#### Parameters

| Parameter            | Type                                         |
| -------------------- | -------------------------------------------- |
| `component`          | `string`                                     |
| `operation`          | `string`                                     |
| `error`              | `unknown`                                    |
| `context?`           | `Readonly`\<`Record`\<`string`, `string`\>\> |
| `options?`           | \{ `correlate?`: `boolean`; \}               |
| `options.correlate?` | `boolean`                                    |

#### Returns

`void`

---

### gauge()

```ts
gauge(name, value): void;
```

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsService.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsService.ts#L39)

Records a gauge without adding request or business identifiers.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `name`    | `string` |
| `value`   | `number` |

#### Returns

`void`
