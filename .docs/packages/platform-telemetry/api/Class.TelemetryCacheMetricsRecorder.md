---
title: 'Class: TelemetryCacheMetricsRecorder'
generated: true
editUrl: false
---

# Class: TelemetryCacheMetricsRecorder

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L15)

Generic cache metrics recorder that forwards cache lifecycle events
into the telemetry facade (which may be a noop when disabled).

## Implements

- `ICacheMetricsRecorder`

## Constructors

### Constructor

```ts
new TelemetryCacheMetricsRecorder(telemetry): TelemetryCacheMetricsRecorder;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L21)

#### Parameters

| Parameter   | Type                                             |
| ----------- | ------------------------------------------------ |
| `telemetry` | [`ITelemetryFacade`](Interface.ITelemetryFacade) |

#### Returns

`TelemetryCacheMetricsRecorder`

## Methods

### recordEviction()

```ts
recordEviction(cache): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L53)

Records a cache eviction.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

`ICacheMetricsRecorder.recordEviction`

---

### recordHit()

```ts
recordHit(cache): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L27)

Records a cache hit.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

`ICacheMetricsRecorder.recordHit`

---

### recordLoadError()

```ts
recordLoadError(cache): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L46)

Records a failed cache load.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

`ICacheMetricsRecorder.recordLoadError`

---

### recordLoadSuccess()

```ts
recordLoadSuccess(cache): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L39)

Records a successful cache load.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

`ICacheMetricsRecorder.recordLoadSuccess`

---

### recordMiss()

```ts
recordMiss(cache): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryCacheMetricsRecorder.ts#L33)

Records a cache miss.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

`ICacheMetricsRecorder.recordMiss`
