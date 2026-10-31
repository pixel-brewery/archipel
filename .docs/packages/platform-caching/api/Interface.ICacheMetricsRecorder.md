---
title: 'Interface: ICacheMetricsRecorder'
generated: true
editUrl: false
---

# Interface: ICacheMetricsRecorder

Defined in: [libs/platform-caching/src/ICacheMetricsRecorder.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheMetricsRecorder.ts#L7)

Metrics recorder for cache operations. Implementations can forward
measurements to Prometheus, OpenTelemetry, or any other backend.

## Methods

### recordEviction()?

```ts
recordEviction?(cache): void;
```

Defined in: [libs/platform-caching/src/ICacheMetricsRecorder.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheMetricsRecorder.ts#L48)

Records a cache eviction.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

---

### recordHit()

```ts
recordHit(cache): void;
```

Defined in: [libs/platform-caching/src/ICacheMetricsRecorder.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheMetricsRecorder.ts#L16)

Records a cache hit.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

---

### recordLoadError()

```ts
recordLoadError(cache): void;
```

Defined in: [libs/platform-caching/src/ICacheMetricsRecorder.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheMetricsRecorder.ts#L40)

Records a failed cache load.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

---

### recordLoadSuccess()

```ts
recordLoadSuccess(cache): void;
```

Defined in: [libs/platform-caching/src/ICacheMetricsRecorder.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheMetricsRecorder.ts#L32)

Records a successful cache load.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`

---

### recordMiss()

```ts
recordMiss(cache): void;
```

Defined in: [libs/platform-caching/src/ICacheMetricsRecorder.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/ICacheMetricsRecorder.ts#L24)

Records a cache miss.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `cache`   | `string` | The cache name / label. |

#### Returns

`void`
