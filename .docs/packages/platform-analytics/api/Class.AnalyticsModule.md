---
title: 'Class: AnalyticsModule'
generated: true
editUrl: false
---

# Class: AnalyticsModule

Defined in: [libs/platform-analytics/src/AnalyticsModule.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/AnalyticsModule.ts#L43)

NestJS module providing generic analytics and error tracking infrastructure.
The specific analytics provider (Sentry, Application Insights, Datadog) is selected via the options.

## Constructors

### Constructor

```ts
new AnalyticsModule(): AnalyticsModule;
```

#### Returns

`AnalyticsModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-analytics/src/AnalyticsModule.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/AnalyticsModule.ts#L53)

Configures the module with the specified options.

#### Parameters

| Parameter | Type                                                           | Description                       |
| --------- | -------------------------------------------------------------- | --------------------------------- |
| `options` | [`IAnalyticsModuleOptions`](Interface.IAnalyticsModuleOptions) | The module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition.
