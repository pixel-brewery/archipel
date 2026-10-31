---
title: 'Class: NoopCacheMetricsRecorder'
generated: true
editUrl: false
---

# Class: NoopCacheMetricsRecorder

Defined in: [libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts#L13)

No-op implementation of [ICacheMetricsRecorder](Interface.ICacheMetricsRecorder) used as the default
when no external metrics backend is configured.

## Implements

- [`ICacheMetricsRecorder`](Interface.ICacheMetricsRecorder)

## Constructors

### Constructor

```ts
new NoopCacheMetricsRecorder(): NoopCacheMetricsRecorder;
```

#### Returns

`NoopCacheMetricsRecorder`

## Methods

### recordEviction()?

```ts
recordEviction?(_cache): void;
```

Defined in: [libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts#L37)

Records a cache eviction.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `_cache`  | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

[`ICacheMetricsRecorder`](Interface.ICacheMetricsRecorder).[`recordEviction`](Interface.ICacheMetricsRecorder#recordeviction)

---

### recordHit()

```ts
recordHit(_cache): void;
```

Defined in: [libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts#L17)

Records a cache hit.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `_cache`  | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

[`ICacheMetricsRecorder`](Interface.ICacheMetricsRecorder).[`recordHit`](Interface.ICacheMetricsRecorder#recordhit)

---

### recordLoadError()

```ts
recordLoadError(_cache): void;
```

Defined in: [libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts#L32)

Records a failed cache load.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `_cache`  | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

[`ICacheMetricsRecorder`](Interface.ICacheMetricsRecorder).[`recordLoadError`](Interface.ICacheMetricsRecorder#recordloaderror)

---

### recordLoadSuccess()

```ts
recordLoadSuccess(_cache): void;
```

Defined in: [libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts#L27)

Records a successful cache load.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `_cache`  | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

[`ICacheMetricsRecorder`](Interface.ICacheMetricsRecorder).[`recordLoadSuccess`](Interface.ICacheMetricsRecorder#recordloadsuccess)

---

### recordMiss()

```ts
recordMiss(_cache): void;
```

Defined in: [libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/metrics/noop/NoopCacheMetricsRecorder.ts#L22)

Records a cache miss.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `_cache`  | `string` | The cache name / label. |

#### Returns

`void`

#### Implementation of

[`ICacheMetricsRecorder`](Interface.ICacheMetricsRecorder).[`recordMiss`](Interface.ICacheMetricsRecorder#recordmiss)
