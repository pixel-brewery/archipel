---
title: 'Class: MetricsService'
generated: true
editUrl: false
---

# Class: MetricsService

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L8)

Records application metrics through OpenTelemetry instruments.

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new MetricsService(client): MetricsService;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L18)

#### Parameters

| Parameter | Type                                         |
| --------- | -------------------------------------------- |
| `client`  | [`OtelMetricClient`](Class.OtelMetricClient) |

#### Returns

`MetricsService`

## Methods

### getInstruments()

```ts
getInstruments(): IMetricInstruments | undefined;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L37)

#### Returns

[`IMetricInstruments`](Interface.IMetricInstruments) \| `undefined`

---

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L29)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### recordCacheEviction()

```ts
recordCacheEviction(cache): void;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L73)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `cache`   | `string` |

#### Returns

`void`

---

### recordCounter()

```ts
recordCounter(
   name,
   value?,
   attributes?
): void;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L41)

#### Parameters

| Parameter     | Type                                         | Default value |
| ------------- | -------------------------------------------- | ------------- |
| `name`        | `string`                                     | `undefined`   |
| `value?`      | `number`                                     | `1`           |
| `attributes?` | `Readonly`\<`Record`\<`string`, `string`\>\> | `{}`          |

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

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L59)

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

### recordGauge()

```ts
recordGauge(
   name,
   value,
   attributes?
): void;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L49)

#### Parameters

| Parameter     | Type                                         |
| ------------- | -------------------------------------------- |
| `name`        | `string`                                     |
| `value`       | `number`                                     |
| `attributes?` | `Readonly`\<`Record`\<`string`, `string`\>\> |

#### Returns

`void`

---

### recordHistogram()

```ts
recordHistogram(
   name,
   value,
   attributes?
): void;
```

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L45)

#### Parameters

| Parameter     | Type                                         |
| ------------- | -------------------------------------------- |
| `name`        | `string`                                     |
| `value`       | `number`                                     |
| `attributes?` | `Readonly`\<`Record`\<`string`, `string`\>\> |

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

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L53)

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

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L69)

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

Defined in: [libs/platform-telemetry/src/otel/MetricsService.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/MetricsService.ts#L65)

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `service`  | `string` |
| `action`   | `string` |
| `failures` | `number` |

#### Returns

`void`
