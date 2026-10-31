---
title: 'Abstract Class: IntelligenceRealtimeSessionBase'
generated: true
editUrl: false
---

# Abstract Class: IntelligenceRealtimeSessionBase

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L10)

Provider-neutral control surface for one realtime model connection.

## Constructors

### Constructor

```ts
new IntelligenceRealtimeSessionBase(): IntelligenceRealtimeSessionBase;
```

#### Returns

`IntelligenceRealtimeSessionBase`

## Accessors

### connectionId

#### Get Signature

```ts
get abstract connectionId(): string;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L21)

##### Returns

`string`

---

### connectionMode

#### Get Signature

```ts
get abstract connectionMode(): "client-secret-websocket" | "server-websocket";
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L27)

##### Returns

`"client-secret-websocket"` \| `"server-websocket"`

---

### model

#### Get Signature

```ts
get abstract model(): string;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L25)

##### Returns

`string`

---

### provider

#### Get Signature

```ts
get abstract provider(): string;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L23)

##### Returns

`string`

---

### sessionId

#### Get Signature

```ts
get abstract sessionId(): string;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L19)

##### Returns

`string`

---

### status

#### Get Signature

```ts
get abstract status(): IntelligenceRealtimeStatus;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L29)

##### Returns

[`IntelligenceRealtimeStatus`](TypeAlias.IntelligenceRealtimeStatus)

## Methods

### addToolOutput()

```ts
abstract addToolOutput(
   callId,
   output,
   name?
): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L64)

Returns a completed function result to the model.

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `callId`  | `string`  |
| `output`  | `unknown` |
| `name?`   | `string`  |

#### Returns

`Promise`\<`void`\>

---

### appendAudio()

```ts
abstract appendAudio(audio): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L42)

Appends a base64-encoded audio fragment to the upstream input buffer.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `audio`   | `string` |

#### Returns

`Promise`\<`void`\>

---

### cancelResponse()

```ts
abstract cancelResponse(): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L61)

Cancels the active model response.

#### Returns

`Promise`\<`void`\>

---

### clearAudio()

```ts
abstract clearAudio(): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L48)

Clears the provider input audio buffer.

#### Returns

`Promise`\<`void`\>

---

### close()

```ts
abstract close(code?, reason?): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L67)

Gracefully closes the upstream connection and flushes metering events.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `code?`   | `number` |
| `reason?` | `string` |

#### Returns

`Promise`\<`void`\>

---

### commitAudio()

```ts
abstract commitAudio(): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L45)

Commits the provider input audio buffer.

#### Returns

`Promise`\<`void`\>

---

### connect()

```ts
abstract connect(): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L36)

Opens the upstream provider WebSocket and applies the session configuration.

#### Returns

`Promise`\<`void`\>

---

### requestResponse()

```ts
abstract requestResponse(options?): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L54)

Requests a new model response.

#### Parameters

| Parameter               | Type                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `options?`              | \{ `instructions?`: `string`; `metadata?`: `Readonly`\<`Record`\<`string`, `unknown`\>\>; `modalities?`: readonly `string`[]; \} |
| `options.instructions?` | `string`                                                                                                                         |
| `options.metadata?`     | `Readonly`\<`Record`\<`string`, `unknown`\>\>                                                                                    |
| `options.modalities?`   | readonly `string`[]                                                                                                              |

#### Returns

`Promise`\<`void`\>

---

### send()

```ts
abstract send(event): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L39)

Sends any provider-neutral client event.

#### Parameters

| Parameter | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `event`   | [`IntelligenceRealtimeClientEvent`](TypeAlias.IntelligenceRealtimeClientEvent) |

#### Returns

`Promise`\<`void`\>

---

### sendText()

```ts
abstract sendText(text, requestResponse?): Promise<void>;
```

Defined in: [libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/realtime/abstracts/IntelligenceRealtimeSessionBase.ts#L51)

Sends a text turn and optionally asks the model to respond.

#### Parameters

| Parameter          | Type      |
| ------------------ | --------- |
| `text`             | `string`  |
| `requestResponse?` | `boolean` |

#### Returns

`Promise`\<`void`\>
