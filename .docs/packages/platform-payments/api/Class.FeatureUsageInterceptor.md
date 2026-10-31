---
title: 'Class: FeatureUsageInterceptor'
generated: true
editUrl: false
---

# Class: FeatureUsageInterceptor

Defined in: [libs/platform-payments/src/interceptors/FeatureUsageInterceptor.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/interceptors/FeatureUsageInterceptor.ts#L20)

Interceptor that records feature usage after successful request handling.
Delegates recording to the registered [FeatureAccessBase](Class.FeatureAccessBase).

## Implements

- `NestInterceptor`

## Constructors

### Constructor

```ts
new FeatureUsageInterceptor(featureAccess, reflector): FeatureUsageInterceptor;
```

Defined in: [libs/platform-payments/src/interceptors/FeatureUsageInterceptor.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/interceptors/FeatureUsageInterceptor.ts#L37)

Constructs a new instance of the `FeatureUsageInterceptor` class.

#### Parameters

| Parameter       | Type                                           | Description                       |
| --------------- | ---------------------------------------------- | --------------------------------- |
| `featureAccess` | [`FeatureAccessBase`](Class.FeatureAccessBase) | The feature access abstract base. |
| `reflector`     | `Reflector`                                    | The NestJS reflector.             |

#### Returns

`FeatureUsageInterceptor`

## Methods

### intercept()

```ts
intercept(context, next): Observable<unknown>;
```

Defined in: [libs/platform-payments/src/interceptors/FeatureUsageInterceptor.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/interceptors/FeatureUsageInterceptor.ts#L54)

Records feature usage after the request handler completes successfully.

#### Parameters

| Parameter | Type               | Description            |
| --------- | ------------------ | ---------------------- |
| `context` | `ExecutionContext` | The execution context. |
| `next`    | `CallHandler`      | The call handler.      |

#### Returns

`Observable`\<`unknown`\>

The observable response stream.

#### Implementation of

`NestInterceptor.intercept`
