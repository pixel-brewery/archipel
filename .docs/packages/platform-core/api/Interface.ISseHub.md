---
title: 'Interface: ISseHub'
generated: true
editUrl: false
---

# Interface: ISseHub

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseHub.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseHub.ts#L13)

Represents a server-sent event service.

## Methods

### clearEvent()

```ts
clearEvent(id): void;
```

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseHub.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseHub.ts#L18)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `id`      | `string` |

#### Returns

`void`

---

### emitEvent()

```ts
emitEvent(id, data): void;
```

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseHub.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseHub.ts#L16)

#### Parameters

| Parameter | Type                                       |
| --------- | ------------------------------------------ |
| `id`      | `string`                                   |
| `data`    | [`ISseEventData`](Interface.ISseEventData) |

#### Returns

`void`

---

### getObservable()

```ts
getObservable(id): Observable<ISseEventData<unknown>>;
```

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseHub.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseHub.ts#L22)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `id`      | `string` |

#### Returns

`Observable`\<[`ISseEventData`](Interface.ISseEventData)\<`unknown`\>\>

---

### isEventActive()

```ts
isEventActive(id): boolean;
```

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseHub.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseHub.ts#L20)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `id`      | `string` |

#### Returns

`boolean`
