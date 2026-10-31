---
title: '@pixel-brewery/archipel-platform-logging'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-logging

## Classes

| Class                                            | Description                                                                                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ContextLogger](Class.ContextLogger)             | Structured logger that automatically enriches log entries with the current request context (requestId, userId) from [RequestContextStore](Class.RequestContextStore).                            |
| [LoggerModule](Class.LoggerModule)               | Global logging module that configures the NestJS Logger with an application-wide log level and provides request-scoped context propagation via [RequestIdMiddleware](Class.RequestIdMiddleware). |
| [RequestContextStore](Class.RequestContextStore) | AsyncLocalStorage-based request context store.                                                                                                                                                   |
| [RequestIdMiddleware](Class.RequestIdMiddleware) | NestJS middleware that extracts or generates a unique request ID and stores it in the [RequestContextStore](Class.RequestContextStore) via `AsyncLocalStorage`.                                  |

## Interfaces

| Interface                                    | Description                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [IRequestContext](Interface.IRequestContext) | Shape of the per-request context stored in [RequestContextStore](Class.RequestContextStore). |

## Variables

| Variable                                                                       | Description                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [APP\_LOG\_LEVEL](Variable.APP_LOG_LEVEL)                                      | Application log level (e.g. `'debug'`, `'info'`, `'warn'`, `'error'`). |
| [PLATFORM\_LOGGING\_CONFIG\_ENTRIES](Variable.PLATFORM_LOGGING_CONFIG_ENTRIES) | All configuration entries required by `platform-logging`.              |
| [REQUEST\_ID\_HEADER](Variable.REQUEST_ID_HEADER)                              | Header name used to propagate the request correlation ID.              |
