---
title: 'Class: AppInsightsAnalyticsClient'
generated: true
editUrl: false
---

# Class: AppInsightsAnalyticsClient

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L23)

Azure Application Insights implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase).
Uses the `applicationinsights` SDK for error tracking and analytics.

## Extends

- [`AnalyticsClientBase`](Class.AnalyticsClientBase)

## Implements

- `OnModuleInit`
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new AppInsightsAnalyticsClient(configService): AppInsightsAnalyticsClient;
```

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L34)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`AppInsightsAnalyticsClient`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`constructor`](Class.AnalyticsClientBase#constructor)

## Methods

### addBreadcrumb()

```ts
addBreadcrumb(breadcrumb): void;
```

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:98](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L98)

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

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L66)

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

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L74)

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

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L92)

Clear the current user context.

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`clearUser`](Class.AnalyticsClientBase#clearuser)

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L60)

Flushes pending Application Insights telemetry before shutdown.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L48)

Initializes the Application Insights SDK.

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

Defined in: [libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/application-insights/AppInsightsAnalyticsClient.ts#L83)

Set the current user context for subsequent events.

#### Parameters

| Parameter | Type                                         | Description              |
| --------- | -------------------------------------------- | ------------------------ |
| `user`    | [`IAnalyticsUser`](Interface.IAnalyticsUser) | The user context to set. |

#### Returns

`void`

#### Overrides

[`AnalyticsClientBase`](Class.AnalyticsClientBase).[`setUser`](Class.AnalyticsClientBase#setuser)
