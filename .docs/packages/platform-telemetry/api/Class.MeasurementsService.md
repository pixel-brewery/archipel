---
title: 'Class: MeasurementsService'
generated: true
editUrl: false
---

# Class: MeasurementsService

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L6)

Records individual numeric values without imposing an aggregation model.

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new MeasurementsService(sink): MeasurementsService;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L16)

#### Parameters

| Parameter | Type                                               |
| --------- | -------------------------------------------------- |
| `sink`    | [`MeasurementSinkBase`](Class.MeasurementSinkBase) |

#### Returns

`MeasurementsService`

## Methods

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L27)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### record()

```ts
record(
   name,
   value,
   attributes?
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L35)

#### Parameters

| Parameter     | Type                                         |
| ------------- | -------------------------------------------- |
| `name`        | `string`                                     |
| `value`       | `number`                                     |
| `attributes?` | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`

---

### recordCacheEviction()

```ts
recordCacheEviction(cache): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L68)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `cache`   | `string` |

#### Returns

`void`

---

### recordExternalHttpRequest()

```ts
recordExternalHttpRequest(
   service,
   action,
   status,
   durationMs
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L54)

#### Parameters

| Parameter    | Type     |
| ------------ | -------- |
| `service`    | `string` |
| `action`     | `string` |
| `status`     | `string` |
| `durationMs` | `number` |

#### Returns

`void`

---

### recordHttpRequest()

```ts
recordHttpRequest(
   method,
   path,
   status,
   durationMs
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L48)

#### Parameters

| Parameter    | Type     |
| ------------ | -------- |
| `method`     | `string` |
| `path`       | `string` |
| `status`     | `string` |
| `durationMs` | `number` |

#### Returns

`void`

---

### setCacheEntries()

```ts
setCacheEntries(cache, entries): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L64)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `cache`   | `string` |
| `entries` | `number` |

#### Returns

`void`

---

### setExternalHttpConsecutiveFailures()

```ts
setExternalHttpConsecutiveFailures(
   service,
   action,
   failures
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsService.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsService.ts#L60)

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `service`  | `string` |
| `action`   | `string` |
| `failures` | `number` |

#### Returns

`void`
