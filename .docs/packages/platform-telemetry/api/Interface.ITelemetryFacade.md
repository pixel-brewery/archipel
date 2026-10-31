---
title: 'Interface: ITelemetryFacade'
generated: true
editUrl: false
---

# Interface: ITelemetryFacade

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:1](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L1)

## Methods

### recordCacheEvent()?

```ts
recordCacheEvent?(event): void;
```

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:3](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L3)

#### Parameters

| Parameter       | Type                                                              |
| --------------- | ----------------------------------------------------------------- |
| `event`         | \{ `cache`: `string`; `outcome`: `string`; `phase?`: `string`; \} |
| `event.cache`   | `string`                                                          |
| `event.outcome` | `string`                                                          |
| `event.phase?`  | `string`                                                          |

#### Returns

`void`

---

### recordClientMetric()?

```ts
recordClientMetric?(
   name,
   type,
   value,
   labels?
): void;
```

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L4)

#### Parameters

| Parameter | Type                           |
| --------- | ------------------------------ |
| `name`    | `string`                       |
| `type`    | `string`                       |
| `value`   | `number`                       |
| `labels?` | `Record`\<`string`, `string`\> |

#### Returns

`void`

---

### runOperation()

```ts
runOperation<T>(name, fn): Promise<T>;
```

Defined in: [libs/platform-telemetry/src/core/NoopTelemetryFacade.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/core/NoopTelemetryFacade.ts#L2)

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
