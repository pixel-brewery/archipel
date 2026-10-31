---
title: 'Class: NoopAnalyticsClient'
generated: true
editUrl: false
---

# Class: NoopAnalyticsClient

Defined in: [libs/platform-analytics/src/noop/NoopAnalyticsClient.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/noop/NoopAnalyticsClient.ts#L18)

No-op implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase).
Suitable for development, testing, or environments where analytics is disabled.

## Extends

- [`AnalyticsClientBase`](Class.AnalyticsClientBase)

## Constructors

### Constructor

```ts
new NoopAnalyticsClient(): NoopAnalyticsClient;
```

#### Returns

`NoopAnalyticsClient`

#### Inherited from

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`constructor`](Class.AnalyticsClientBase#constructor)

## Methods

### addBreadcrumb()

```ts
addBreadcrumb(_breadcrumb): void;
```

Defined in: [libs/platform-analytics/src/noop/NoopAnalyticsClient.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/noop/NoopAnalyticsClient.ts#L42)

Add a breadcrumb entry to the analytics trail.

#### Parameters

| Parameter     | Type                                                     | Description            |
| ------------- | -------------------------------------------------------- | ---------------------- |
| `_breadcrumb` | [`IAnalyticsBreadcrumb`](Interface.IAnalyticsBreadcrumb) | The breadcrumb to add. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`addBreadcrumb`](Class.AnalyticsClientBase#addbreadcrumb)

---

### captureException()

```ts
captureException(_error, _context?): void;
```

Defined in: [libs/platform-analytics/src/noop/NoopAnalyticsClient.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/noop/NoopAnalyticsClient.ts#L22)

Capture an exception with optional context.

#### Parameters

| Parameter   | Type                            | Description                           |
| ----------- | ------------------------------- | ------------------------------------- |
| `_error`    | `Error`                         | The error to capture.                 |
| `_context?` | `Record`\<`string`, `unknown`\> | Optional additional context metadata. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`captureException`](Class.AnalyticsClientBase#captureexception)

---

### captureMessage()

```ts
captureMessage(
   _message,
   _level,
   _context?
): void;
```

Defined in: [libs/platform-analytics/src/noop/NoopAnalyticsClient.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/noop/NoopAnalyticsClient.ts#L27)

Capture a message with a specific severity level.

#### Parameters

| Parameter   | Type                                         | Description                           |
| ----------- | -------------------------------------------- | ------------------------------------- |
| `_message`  | `string`                                     | The message to capture.               |
| `_level`    | [`AnalyticsLevel`](TypeAlias.AnalyticsLevel) | Severity level of the message.        |
| `_context?` | `Record`\<`string`, `unknown`\>              | Optional additional context metadata. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`captureMessage`](Class.AnalyticsClientBase#capturemessage)

---

### clearUser()

```ts
clearUser(): void;
```

Defined in: [libs/platform-analytics/src/noop/NoopAnalyticsClient.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/noop/NoopAnalyticsClient.ts#L37)

Clear the current user context.

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`clearUser`](Class.AnalyticsClientBase#clearuser)

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L74)

Lightweight readiness check for the analytics provider.
Override in adapters to verify SDK initialization.
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is ready.

#### Inherited from

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`ping`](Class.AnalyticsClientBase#ping)

---

### setUser()

```ts
setUser(_user): void;
```

Defined in: [libs/platform-analytics/src/noop/NoopAnalyticsClient.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/noop/NoopAnalyticsClient.ts#L32)

Set the current user context for subsequent events.

#### Parameters

| Parameter | Type                                         | Description              |
| --------- | -------------------------------------------- | ------------------------ |
| `_user`   | [`IAnalyticsUser`](Interface.IAnalyticsUser) | The user context to set. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`setUser`](Class.AnalyticsClientBase#setuser)
