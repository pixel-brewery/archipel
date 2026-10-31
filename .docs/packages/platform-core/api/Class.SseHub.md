---
title: 'Class: SseHub'
generated: true
editUrl: false
---

# Class: SseHub

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L16)

Represents a server-sent event service.

## Implements

- [`ISseHub`](Interface.ISseHub)
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new SseHub(): SseHub;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L31)

Constructs a new instance of the `SseService` class.

#### Returns

`SseHub`

## Methods

### clearEvent()

```ts
clearEvent(id): void;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:119](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L119)

Clears the event with the specified ID.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `id`      | `string` | The ID of the event. |

#### Returns

`void`

#### Implementation of

[`ISseHub`](Interface.ISseHub).[`clearEvent`](Interface.ISseHub#clearevent)

---

### emitEvent()

```ts
emitEvent(id, data): void;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:94](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L94)

Emits an event with the specified ID and data.

#### Parameters

| Parameter | Type                                       | Description            |
| --------- | ------------------------------------------ | ---------------------- |
| `id`      | `string`                                   | The ID of the event.   |
| `data`    | [`ISseEventData`](Interface.ISseEventData) | The data of the event. |

#### Returns

`void`

#### Implementation of

[`ISseHub`](Interface.ISseHub).[`emitEvent`](Interface.ISseHub#emitevent)

---

### getObservable()

```ts
getObservable(eventId): Observable<ISseEventData<unknown>>;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:149](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L149)

Gets an observable for the event with the specified ID.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `eventId` | `string` | The ID of the event. |

#### Returns

`Observable`\<[`ISseEventData`](Interface.ISseEventData)\<`unknown`\>\>

An observable for the event.

#### Implementation of

[`ISseHub`](Interface.ISseHub).[`getObservable`](Interface.ISseHub#getobservable)

---

### isEventActive()

```ts
isEventActive(id): boolean;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:136](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L136)

Determines whether the event with the specified ID is active.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `id`      | `string` | The ID of the event. |

#### Returns

`boolean`

`true` if the event is active; otherwise, `false`.

#### Implementation of

[`ISseHub`](Interface.ISseHub).[`isEventActive`](Interface.ISseHub#iseventactive)

---

### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L44)

Completes all active event subjects and clears the registry on module destruction.

#### Returns

`void`

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### registerEvent()

```ts
registerEvent(id): void;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L58)

Registers an event with the specified ID.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `id`      | `string` | The ID of the event. |

#### Returns

`void`

---

### unregisterEvent()

```ts
unregisterEvent(id): void;
```

Defined in: [libs/platform-core/src/sse/services/SseHub.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/SseHub.ts#L77)

Unregisters an event with the specified ID.

#### Parameters

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `id`      | `string` | The ID of the event. |

#### Returns

`void`
