---
title: 'Class: MeasurementsInterceptor'
generated: true
editUrl: false
---

# Class: MeasurementsInterceptor

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsInterceptor.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsInterceptor.ts#L11)

Records completed HTTP request values through the direct measurement path.

## Implements

- `NestInterceptor`

## Constructors

### Constructor

```ts
new MeasurementsInterceptor(
   measurements,
   diagnostics?,
   options?
): MeasurementsInterceptor;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsInterceptor.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsInterceptor.ts#L22)

#### Parameters

| Parameter      | Type                                                                 | Default value |
| -------------- | -------------------------------------------------------------------- | ------------- |
| `measurements` | [`MeasurementsService`](Class.MeasurementsService)                   | `undefined`   |
| `diagnostics?` | [`DiagnosticsService`](Class.DiagnosticsService) \| `null`           | `null`        |
| `options?`     | [`IMeasurementsModuleOptions`](Interface.IMeasurementsModuleOptions) | `undefined`   |

#### Returns

`MeasurementsInterceptor`

## Methods

### intercept()

```ts
intercept(context, next): Observable<unknown>;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsInterceptor.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsInterceptor.ts#L39)

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
