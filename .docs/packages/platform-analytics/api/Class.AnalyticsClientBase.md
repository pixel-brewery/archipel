---
title: 'Abstract Class: AnalyticsClientBase'
generated: true
editUrl: false
---

# Abstract Class: AnalyticsClientBase

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L12)

Abstract base for analytics and error tracking clients.
Each provider (Sentry, Application Insights, Datadog) must implement this contract
so that the consuming application can switch providers without changing business logic.

## Extended by

- [`NoopAnalyticsClient`](Class.NoopAnalyticsClient)
- [`SentryAnalyticsClient`](Class.SentryAnalyticsClient)
- [`AppInsightsAnalyticsClient`](Class.AppInsightsAnalyticsClient)
- [`DatadogAnalyticsClient`](Class.DatadogAnalyticsClient)

## Constructors

### Constructor

```ts
new AnalyticsClientBase(): AnalyticsClientBase;
```

#### Returns

`AnalyticsClientBase`

## Methods

### addBreadcrumb()

```ts
abstract addBreadcrumb(breadcrumb): void;
```

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L64)

Add a breadcrumb entry to the analytics trail.

#### Parameters

| Parameter    | Type                                                     | Description            |
| ------------ | -------------------------------------------------------- | ---------------------- |
| `breadcrumb` | [`IAnalyticsBreadcrumb`](Interface.IAnalyticsBreadcrumb) | The breadcrumb to add. |

#### Returns

`void`

---

### captureException()

```ts
abstract captureException(error, context?): void;
```

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L31)

Capture an exception with optional context.

#### Parameters

| Parameter  | Type                            | Description                           |
| ---------- | ------------------------------- | ------------------------------------- |
| `error`    | `Error`                         | The error to capture.                 |
| `context?` | `Record`\<`string`, `unknown`\> | Optional additional context metadata. |

#### Returns

`void`

---

### captureMessage()

```ts
abstract captureMessage(
   message,
   level,
   context?
): void;
```

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L41)

Capture a message with a specific severity level.

#### Parameters

| Parameter  | Type                                         | Description                           |
| ---------- | -------------------------------------------- | ------------------------------------- |
| `message`  | `string`                                     | The message to capture.               |
| `level`    | [`AnalyticsLevel`](TypeAlias.AnalyticsLevel) | Severity level of the message.        |
| `context?` | `Record`\<`string`, `unknown`\>              | Optional additional context metadata. |

#### Returns

`void`

---

### clearUser()

```ts
abstract clearUser(): void;
```

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L56)

Clear the current user context.

#### Returns

`void`

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

---

### setUser()

```ts
abstract setUser(user): void;
```

Defined in: [libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/abstracts/AnalyticsClientBase.ts#L49)

Set the current user context for subsequent events.

#### Parameters

| Parameter | Type                                         | Description              |
| --------- | -------------------------------------------- | ------------------------ |
| `user`    | [`IAnalyticsUser`](Interface.IAnalyticsUser) | The user context to set. |

#### Returns

`void`
