---
title: 'Class: TelemetryFacade'
generated: true
editUrl: false
---

# Class: TelemetryFacade

Defined in: [libs/platform-telemetry/src/core/TelemetryFacade.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryFacade.ts#L6)

## Implements

- [`ITelemetryFacade`](Interface.ITelemetryFacade)

## Constructors

### Constructor

```ts
new TelemetryFacade(
   logger?,
   metrics?,
   pattern?
): TelemetryFacade;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryFacade.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryFacade.ts#L17)

#### Parameters

| Parameter                         | Type                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `logger?`                         | `Logger`                                                                      |
| `metrics?`                        | [`MetricsService`](Class.MetricsService)                                      |
| `pattern?`                        | \{ `enableCacheMetrics?`: `boolean`; `enableOperationMetrics?`: `boolean`; \} |
| `pattern.enableCacheMetrics?`     | `boolean`                                                                     |
| `pattern.enableOperationMetrics?` | `boolean`                                                                     |

#### Returns

`TelemetryFacade`

## Methods

### getLogger()

```ts
getLogger(): Logger;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryFacade.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryFacade.ts#L70)

#### Returns

`Logger`

---

### recordCacheEvent()

```ts
recordCacheEvent(event): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryFacade.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryFacade.ts#L49)

#### Parameters

| Parameter       | Type                                                              |
| --------------- | ----------------------------------------------------------------- |
| `event`         | \{ `cache`: `string`; `outcome`: `string`; `phase?`: `string`; \} |
| `event.cache`   | `string`                                                          |
| `event.outcome` | `string`                                                          |
| `event.phase?`  | `string`                                                          |

#### Returns

`void`

#### Implementation of

[`ITelemetryFacade`](Interface.ITelemetryFacade).[`recordCacheEvent`](Interface.ITelemetryFacade#recordcacheevent)

---

### recordClientMetric()

```ts
recordClientMetric(
   name,
   type,
   value,
   labels?
): void;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryFacade.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryFacade.ts#L58)

#### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `name`    | `string`                       |
| `type`    | `string`                       |
| `value`   | `number`                       |
| `labels?` | `Record`\<`string`, `string`\> |

#### Returns

`void`

#### Implementation of

[`ITelemetryFacade`](Interface.ITelemetryFacade).[`recordClientMetric`](Interface.ITelemetryFacade#recordclientmetric)

---

### runOperation()

```ts
runOperation<T>(name, fn): Promise<T>;
```

Defined in: [libs/platform-telemetry/src/core/TelemetryFacade.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/TelemetryFacade.ts#L27)

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `name`    | `string`                      |
| `fn`      | () => `T` \| `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`ITelemetryFacade`](Interface.ITelemetryFacade).[`runOperation`](Interface.ITelemetryFacade#runoperation)
