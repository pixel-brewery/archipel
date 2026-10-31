---
title: 'Class: NoopTelemetryFacade'
generated: true
editUrl: false
---

# Class: NoopTelemetryFacade

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L7)

## Implements

- [`ITelemetryFacade`](Interface.ITelemetryFacade)

## Constructors

### Constructor

```ts
new NoopTelemetryFacade(): NoopTelemetryFacade;
```

#### Returns

`NoopTelemetryFacade`

## Methods

### recordCacheEvent()?

```ts
recordCacheEvent?(_): void;
```

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L11)

#### Parameters

| Parameter   | Type                                                              |
| ----------- | ----------------------------------------------------------------- |
| `_`         | \{ `cache`: `string`; `outcome`: `string`; `phase?`: `string`; \} |
| `_.cache`   | `string`                                                          |
| `_.outcome` | `string`                                                          |
| `_.phase?`  | `string`                                                          |

#### Returns

`void`

#### Implementation of

[`ITelemetryFacade`](Interface.ITelemetryFacade).[`recordCacheEvent`](Interface.ITelemetryFacade#recordcacheevent)

---

### recordClientMetric()?

```ts
recordClientMetric?(
   _name,
   _type,
   _value,
   _labels?
): void;
```

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L14)

#### Parameters

| Parameter  | Type                           |
| ---------- | ------------------------------ |
| `_name`    | `string`                       |
| `_type`    | `string`                       |
| `_value`   | `number`                       |
| `_labels?` | `Record`\<`string`, `string`\> |

#### Returns

`void`

#### Implementation of

[`ITelemetryFacade`](Interface.ITelemetryFacade).[`recordClientMetric`](Interface.ITelemetryFacade#recordclientmetric)

---

### runOperation()

```ts
runOperation<T>(_, fn): Promise<T>;
```

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L8)

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type                          |
| --------- | ----------------------------- |
| `_`       | `string`                      |
| `fn`      | () => `T` \| `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`ITelemetryFacade`](Interface.ITelemetryFacade).[`runOperation`](Interface.ITelemetryFacade#runoperation)
