---
title: 'Class: DatadogAnalyticsClient'
generated: true
editUrl: false
---

# Class: DatadogAnalyticsClient

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L21)

Datadog implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase).
Uses the `dd-trace` SDK for error tracking and analytics.

## Extends

- [`AnalyticsClientBase`](Class.AnalyticsClientBase)

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new DatadogAnalyticsClient(configService): DatadogAnalyticsClient;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L33)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`DatadogAnalyticsClient`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`constructor`](Class.AnalyticsClientBase#constructor)

## Methods

### addBreadcrumb()

```ts
addBreadcrumb(breadcrumb): void;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L129)

Add a breadcrumb entry to the analytics trail.

#### Parameters

| Parameter    | Type                                                     | Description            |
| ------------ | -------------------------------------------------------- | ---------------------- |
| `breadcrumb` | [`IAnalyticsBreadcrumb`](Interface.IAnalyticsBreadcrumb) | The breadcrumb to add. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`addBreadcrumb`](Class.AnalyticsClientBase#addbreadcrumb)

---

### captureException()

```ts
captureException(error, context?): void;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L59)

Capture an exception with optional context.

#### Parameters

| Parameter  | Type                            | Description                           |
| ---------- | ------------------------------- | ------------------------------------- |
| `error`    | `Error`                         | The error to capture.                 |
| `context?` | `Record`\<`string`, `unknown`\> | Optional additional context metadata. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`captureException`](Class.AnalyticsClientBase#captureexception)

---

### captureMessage()

```ts
captureMessage(
   message,
   level,
   context?
): void;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L84)

Capture a message with a specific severity level.

#### Parameters

| Parameter  | Type                                         | Description                           |
| ---------- | -------------------------------------------- | ------------------------------------- |
| `message`  | `string`                                     | The message to capture.               |
| `level`    | [`AnalyticsLevel`](TypeAlias.AnalyticsLevel) | Severity level of the message.        |
| `context?` | `Record`\<`string`, `unknown`\>              | Optional additional context metadata. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`captureMessage`](Class.AnalyticsClientBase#capturemessage)

---

### clearUser()

```ts
clearUser(): void;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:124](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L124)

Clear the current user context.

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`clearUser`](Class.AnalyticsClientBase#clearuser)

---

### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L49)

Initializes the Datadog tracer SDK.

#### Returns

`void`

#### Implementation of

`OnModuleInit.onModuleInit`

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
setUser(user): void;
```

Defined in: [libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/datadog/DatadogAnalyticsClient.ts#L105)

Set the current user context for subsequent events.

#### Parameters

| Parameter | Type                                         | Description              |
| --------- | -------------------------------------------- | ------------------------ |
| `user`    | [`IAnalyticsUser`](Interface.IAnalyticsUser) | The user context to set. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`setUser`](Class.AnalyticsClientBase#setuser)
