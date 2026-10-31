---
title: 'Interface: IAnalyticsModuleOptions'
generated: true
editUrl: false
---

# Interface: IAnalyticsModuleOptions

Defined in: [libs/platform-analytics/src/AnalyticsModule.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/AnalyticsModule.ts#L16)

Configuration options for the `AnalyticsModule`.

## Properties

### analyticsClient

```ts
analyticsClient: Type<AnalyticsClientBase>;
```

Defined in: [libs/platform-analytics/src/AnalyticsModule.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/AnalyticsModule.ts#L21)

Concrete implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase).
For example, `SentryAnalyticsClient`, `AppInsightsAnalyticsClient`, `DatadogAnalyticsClient`, or `NoopAnalyticsClient`.

---

### configEntries?

```ts
configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-analytics/src/AnalyticsModule.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/AnalyticsModule.ts#L26)

Provider-specific configuration entries to register with the config module.

---

### isGlobal?

```ts
isGlobal?: boolean;
```

Defined in: [libs/platform-analytics/src/AnalyticsModule.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-analytics/src/AnalyticsModule.ts#L31)

When `true` the module is registered globally.
