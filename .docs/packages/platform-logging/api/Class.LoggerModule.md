---
title: 'Class: LoggerModule'
generated: true
editUrl: false
---

# Class: LoggerModule

Defined in: [libs/platform-logging/src/LoggerModule.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/LoggerModule.ts#L48)

Global logging module that configures the NestJS Logger with an application-wide log level
and provides request-scoped context propagation via [RequestIdMiddleware](Class.RequestIdMiddleware).

## Remarks

Apply [RequestIdMiddleware](Class.RequestIdMiddleware) in your `AppModule.configure()` to enable
automatic `requestId` propagation to all log entries via [ContextLogger](Class.ContextLogger).

## Constructors

### Constructor

```ts
new LoggerModule(): LoggerModule;
```

#### Returns

`LoggerModule`
