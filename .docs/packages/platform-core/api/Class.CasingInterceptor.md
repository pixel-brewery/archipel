---
title: 'Class: CasingInterceptor'
generated: true
editUrl: false
---

# Class: CasingInterceptor

Defined in: [libs/platform-core/src/interceptors/CasingInterceptor.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/interceptors/CasingInterceptor.ts#L27)

Global NestJS interceptor that normalizes property casing across the HTTP boundary.

**Request (inbound):** Converts `snake_case` (or other casing styles) keys in the
request body to `camelCase` before they reach controllers.

**Response (outbound):** Currently passes data through unchanged. If outbound
transformation is needed in the future, it can be added in the `map` operator.

## Remarks

Because this interceptor is applied globally, **all JSON request bodies are
camelCase-normalized** and **all JSON responses use camelCase property names**.
OpenAPI / Swagger schemas therefore always reflect camelCase keys.

## Implements

- `NestInterceptor`

## Constructors

### Constructor

```ts
new CasingInterceptor(): CasingInterceptor;
```

#### Returns

`CasingInterceptor`

## Methods

### intercept()

```ts
intercept(context, next): Observable<unknown>;
```

Defined in: [libs/platform-core/src/interceptors/CasingInterceptor.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/interceptors/CasingInterceptor.ts#L28)

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

---

### process()

```ts
process<T>(value): T;
```

Defined in: [libs/platform-core/src/interceptors/CasingInterceptor.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/interceptors/CasingInterceptor.ts#L47)

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type |
| --------- | ---- |
| `value`   | `T`  |

#### Returns

`T`
