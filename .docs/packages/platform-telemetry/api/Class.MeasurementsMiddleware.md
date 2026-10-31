---
title: 'Class: MeasurementsMiddleware'
generated: true
editUrl: false
---

# Class: MeasurementsMiddleware

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsMiddleware.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsMiddleware.ts#L11)

Measures response completion, including guards, serialization, unmatched routes and client aborts.

## Implements

- `NestMiddleware`

## Constructors

### Constructor

```ts
new MeasurementsMiddleware(measurements): MeasurementsMiddleware;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsMiddleware.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsMiddleware.ts#L20)

#### Parameters

| Parameter      | Type                                               |
| -------------- | -------------------------------------------------- |
| `measurements` | [`MeasurementsService`](Class.MeasurementsService) |

#### Returns

`MeasurementsMiddleware`

## Methods

### use()

```ts
use(
   request,
   response,
   next
): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsMiddleware.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsMiddleware.ts#L31)

#### Parameters

| Parameter  | Type                                                                                 |
| ---------- | ------------------------------------------------------------------------------------ |
| `request`  | `IncomingMessage` & \{ `route?`: \{ `path?`: `string` \| readonly `string`[]; \}; \} |
| `response` | `ServerResponse`                                                                     |
| `next`     | () => `void`                                                                         |

#### Returns

`void`

#### Implementation of

`NestMiddleware.use`
