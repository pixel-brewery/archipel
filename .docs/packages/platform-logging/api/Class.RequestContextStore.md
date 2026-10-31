---
title: 'Class: RequestContextStore'
generated: true
editUrl: false
---

# Class: RequestContextStore

Defined in: [libs/platform-logging/src/RequestContextStore.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L29)

AsyncLocalStorage-based request context store.

Provides a per-request context accessible anywhere in the call stack
without passing parameters explicitly. This is the foundation for
structured logging with automatic `requestId` propagation.

## Constructors

### Constructor

```ts
new RequestContextStore(): RequestContextStore;
```

#### Returns

`RequestContextStore`

## Methods

### get()

```ts
static get(): IRequestContext | undefined;
```

Defined in: [libs/platform-logging/src/RequestContextStore.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L57)

Returns the current request context, or `undefined` if called
outside a request scope.

#### Returns

[`IRequestContext`](Interface.IRequestContext) \| `undefined`

---

### getRequestId()

```ts
static getRequestId(): string;
```

Defined in: [libs/platform-logging/src/RequestContextStore.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L66)

Returns the current `requestId`, or `'unknown'` if no context is active.

#### Returns

`string`

---

### run()

```ts
static run<T>(context, callback): T;
```

Defined in: [libs/platform-logging/src/RequestContextStore.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L47)

Runs a callback within a new request context.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter  | Type                                           | Description                                                   |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `context`  | [`IRequestContext`](Interface.IRequestContext) | The request context to associate with the callback execution. |
| `callback` | () => `T`                                      | The function to execute within the context.                   |

#### Returns

`T`

The return value of the callback.
