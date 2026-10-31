---
title: 'Class: EventHub'
generated: true
editUrl: false
---

# Class: EventHub

Defined in: [libs/platform-core/src/events/EventHub.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L37)

Provides a strongly typed event hub that can publish and subscribe to events.

## Implements

- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new EventHub(): EventHub;
```

Defined in: [libs/platform-core/src/events/EventHub.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L49)

Initializes a new instance of the EventHub class.

#### Returns

`EventHub`

## Accessors

### events

#### Get Signature

```ts
get events(): Observable<AnyEventNotification>;
```

Defined in: [libs/platform-core/src/events/EventHub.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L63)

Gets the observable sequence that exposes all events published within the hub.

##### Returns

`Observable`\<`AnyEventNotification`\>

## Methods

### observe()

```ts
observe<TEvents, TKey>(eventKey): Observable<TEvents[TKey]>;
```

Defined in: [libs/platform-core/src/events/EventHub.ts:119](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L119)

Returns an observable that emits payloads for the specified event.

#### Type Parameters

| Type Parameter                                                                             |
| ------------------------------------------------------------------------------------------ |
| <a id="type-parameter-tevents"></a> `TEvents` _extends_ [`IEventMap`](Interface.IEventMap) |
| <a id="type-parameter-tkey"></a> `TKey` _extends_ `string` \| `number` \| `symbol`         |

#### Parameters

| Parameter  | Type                                                    | Description              |
| ---------- | ------------------------------------------------------- | ------------------------ |
| `eventKey` | [`IEventKey`](Interface.IEventKey)\<`TEvents`, `TKey`\> | The event key to observe |

#### Returns

`Observable`\<`TEvents`\[`TKey`\]\>

An observable sequence that emits payloads of the specified event

---

### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [libs/platform-core/src/events/EventHub.ts:135](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L135)

Completes the event stream when the module is destroyed.

#### Returns

`void`

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### publish()

```ts
publish<TEvents, TKey>(eventKey, payload): void;
```

Defined in: [libs/platform-core/src/events/EventHub.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L78)

Publishes an event with the specified payload to all subscribers.

#### Type Parameters

| Type Parameter                                                                               |
| -------------------------------------------------------------------------------------------- |
| <a id="type-parameter-tevents-1"></a> `TEvents` _extends_ [`IEventMap`](Interface.IEventMap) |
| <a id="type-parameter-tkey-1"></a> `TKey` _extends_ `string` \| `number` \| `symbol`         |

#### Parameters

| Parameter  | Type                                                    | Description                                |
| ---------- | ------------------------------------------------------- | ------------------------------------------ |
| `eventKey` | [`IEventKey`](Interface.IEventKey)\<`TEvents`, `TKey`\> | The event key identifying the target event |
| `payload`  | `TEvents`\[`TKey`\]                                     | The payload associated with the event      |

#### Returns

`void`

---

### subscribe()

```ts
subscribe<TEvents, TKey>(eventKey, handler): Subscription;
```

Defined in: [libs/platform-core/src/events/EventHub.ts:99](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventHub.ts#L99)

Subscribes to the specified event and invokes the handler whenever the event is published.

#### Type Parameters

| Type Parameter                                                                               |
| -------------------------------------------------------------------------------------------- |
| <a id="type-parameter-tevents-2"></a> `TEvents` _extends_ [`IEventMap`](Interface.IEventMap) |
| <a id="type-parameter-tkey-2"></a> `TKey` _extends_ `string` \| `number` \| `symbol`         |

#### Parameters

| Parameter  | Type                                                    | Description                                           |
| ---------- | ------------------------------------------------------- | ----------------------------------------------------- |
| `eventKey` | [`IEventKey`](Interface.IEventKey)\<`TEvents`, `TKey`\> | The event key to subscribe to                         |
| `handler`  | (`payload`) => `void`                                   | The handler that is invoked when the event is emitted |

#### Returns

`Subscription`

The subscription that can be disposed to unsubscribe from the event stream
