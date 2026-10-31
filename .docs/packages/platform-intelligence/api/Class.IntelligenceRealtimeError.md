---
title: 'Class: IntelligenceRealtimeError'
generated: true
editUrl: false
---

# Class: IntelligenceRealtimeError

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L6)

Error raised by a realtime session, transport, or metering adapter.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new IntelligenceRealtimeError(
   message,
   phase,
   provider,
   model,
   sessionId,
   isRetryable,
   cause?
): IntelligenceRealtimeError;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L19)

#### Parameters

| Parameter     | Type                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `message`     | `string`                                                                                                 |
| `phase`       | \| `"configuration"` \| `"token"` \| `"connect"` \| `"send"` \| `"receive"` \| `"metering"` \| `"close"` |
| `provider`    | `string`                                                                                                 |
| `model`       | `string`                                                                                                 |
| `sessionId`   | `string`                                                                                                 |
| `isRetryable` | `boolean`                                                                                                |
| `cause?`      | `Error`                                                                                                  |

#### Returns

`IntelligenceRealtimeError`

#### Overrides

`Error.constructor`

## Properties

### isRetryable

```ts
readonly isRetryable: boolean;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L13)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L11)

---

### phase

```ts
readonly phase:
  | "configuration"
  | "token"
  | "connect"
  | "send"
  | "receive"
  | "metering"
  | "close";
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L9)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L10)

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceRealtimeError.ts#L12)
