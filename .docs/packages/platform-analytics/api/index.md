---
title: '@pixel-brewery/archipel-platform-analytics'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-analytics

## Classes

| Class                                                          | Description                                                                                                                                                                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AnalyticsClientBase](Class.AnalyticsClientBase)               | Abstract base for analytics and error tracking clients. Each provider (Sentry, Application Insights, Datadog) must implement this contract so that the consuming application can switch providers without changing business logic. |
| [AnalyticsHealthIndicator](Class.AnalyticsHealthIndicator)     | Health indicator for the analytics infrastructure. Calls [AnalyticsClientBase.ping](Class.AnalyticsClientBase#ping) to verify provider readiness.                                                                                  |
| [AnalyticsModule](Class.AnalyticsModule)                       | NestJS module providing generic analytics and error tracking infrastructure. The specific analytics provider (Sentry, Application Insights, Datadog) is selected via the options.                                                  |
| [AppInsightsAnalyticsClient](Class.AppInsightsAnalyticsClient) | Azure Application Insights implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase). Uses the `applicationinsights` SDK for error tracking and analytics.                                                            |
| [DatadogAnalyticsClient](Class.DatadogAnalyticsClient)         | Datadog implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase). Uses the `dd-trace` SDK for error tracking and analytics.                                                                                          |
| [NoopAnalyticsClient](Class.NoopAnalyticsClient)               | No-op implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase). Suitable for development, testing, or environments where analytics is disabled.                                                                      |
| [SentryAnalyticsClient](Class.SentryAnalyticsClient)           | Sentry implementation of the [AnalyticsClientBase](Class.AnalyticsClientBase). Uses the official `@sentry/node` SDK for error tracking and analytics.                                                                              |

## Interfaces

| Interface                                                    | Description                                        |
| ------------------------------------------------------------ | -------------------------------------------------- |
| [IAnalyticsBreadcrumb](Interface.IAnalyticsBreadcrumb)       | Represents a breadcrumb entry for analytics trail. |
| [IAnalyticsModuleOptions](Interface.IAnalyticsModuleOptions) | Configuration options for the `AnalyticsModule`.   |
| [IAnalyticsUser](Interface.IAnalyticsUser)                   | Represents user context for analytics tracking.    |

## Type Aliases

| Type Alias                                 | Description                            |
| ------------------------------------------ | -------------------------------------- |
| [AnalyticsLevel](TypeAlias.AnalyticsLevel) | Severity level for analytics messages. |

## Variables

| Variable                                                                                  | Description                                                                    |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [APPINSIGHTS\_CONFIG\_ENTRIES](Variable.APPINSIGHTS_CONFIG_ENTRIES)                       | Configuration entries required by the Application Insights analytics provider. |
| [APPLICATIONINSIGHTS\_CONNECTION\_STRING](Variable.APPLICATIONINSIGHTS_CONNECTION_STRING) | Application Insights connection string.                                        |
| [DATADOG\_CONFIG\_ENTRIES](Variable.DATADOG_CONFIG_ENTRIES)                               | Configuration entries required by the Datadog analytics provider.              |
| [DD\_ENV](Variable.DD_ENV)                                                                | Datadog environment identifier (e.g. `production`, `staging`).                 |
| [DD\_SERVICE](Variable.DD_SERVICE)                                                        | Datadog service name.                                                          |
| [SENTRY\_CONFIG\_ENTRIES](Variable.SENTRY_CONFIG_ENTRIES)                                 | Configuration entries required by the Sentry analytics provider.               |
| [SENTRY\_DSN](Variable.SENTRY_DSN)                                                        | Sentry DSN for error tracking.                                                 |
| [SENTRY\_ENVIRONMENT](Variable.SENTRY_ENVIRONMENT)                                        | Sentry environment identifier (e.g. `production`, `staging`).                  |
