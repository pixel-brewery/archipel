---
title: 'Class: OtelMetricsInterceptor'
generated: true
editUrl: false
---

# Class: OtelMetricsInterceptor

Defined in: [libs/platform-telemetry/src/otel/OtelMetricsInterceptor.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/OtelMetricsInterceptor.ts#L8)

Records completed HTTP requests through OpenTelemetry instruments.

## Implements

- `NestInterceptor`

## Constructors

### Constructor

```ts
new OtelMetricsInterceptor(metrics): OtelMetricsInterceptor;
```

Defined in: [libs/platform-telemetry/src/otel/OtelMetricsInterceptor.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/OtelMetricsInterceptor.ts#L17)

#### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `metrics` | [`MetricsService`](Class.MetricsService) |

#### Returns

`OtelMetricsInterceptor`

## Methods

### intercept()

```ts
intercept(context, next): Observable<unknown>;
```

Defined in: [libs/platform-telemetry/src/otel/OtelMetricsInterceptor.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/OtelMetricsInterceptor.ts#L28)

Method to implement a custom interceptor.

#### Parameters

| Parameter | Type               | Description                                                                                                                         |
| --------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `context` | `ExecutionContext` | an `ExecutionContext` object providing methods to access the route handler and class about to be invoked.                           |
| `next`    | `CallHandler`      | a reference to the `CallHandler`, which provides access to an `Observable` representing the response stream from the route handler. |

#### Returns

`Observable`\<`unknown`\>

#### Implementation of

`NestInterceptor.intercept`
