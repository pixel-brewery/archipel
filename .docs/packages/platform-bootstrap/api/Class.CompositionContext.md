---
title: 'Class: CompositionContext'
generated: true
editUrl: false
---

# Class: CompositionContext

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L17)

Default implementation of the composition context.

Wraps a temporary NestJS application context and provides convenient
access to configuration values during module composition.

## Implements

- [`ICompositionContext`](Interface.ICompositionContext)

## Constructors

### Constructor

```ts
new CompositionContext(context, config): CompositionContext;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L35)

Constructs a new composition context.

#### Parameters

| Parameter | Type                      | Description                               |
| --------- | ------------------------- | ----------------------------------------- |
| `context` | `INestApplicationContext` | The temporary NestJS application context. |
| `config`  | `ConfigService`           | The configuration service instance.       |

#### Returns

`CompositionContext`

## Accessors

### config

#### Get Signature

```ts
get config(): ConfigService;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L54)

The Archipel configuration service.

Provides typed access to environment configuration values.

##### Returns

`ConfigService`

The Archipel configuration service.

Provides typed access to environment configuration values.

#### Implementation of

[`ICompositionContext`](Interface.ICompositionContext).[`config`](Interface.ICompositionContext#config)

---

### context

#### Get Signature

```ts
get context(): INestApplicationContext;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L47)

The temporary NestJS application context.

Used only for dependency injection resolution during composition.
Do not use this context for runtime services.

##### Returns

`INestApplicationContext`

The temporary NestJS application context.

Used only for dependency injection resolution during composition.
Do not use this context for runtime services.

#### Implementation of

[`ICompositionContext`](Interface.ICompositionContext).[`context`](Interface.ICompositionContext#context)

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L86)

Closes the temporary composition context.

Must be called after the real application has been created to release
resources held by the composition context.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the context is closed.

#### Implementation of

[`ICompositionContext`](Interface.ICompositionContext).[`close`](Interface.ICompositionContext#close)

---

### getConfigValue()

```ts
getConfigValue<T>(key): T;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L65)

Reads a required configuration value.

#### Type Parameters

| Type Parameter                    | Description                                   |
| --------------------------------- | --------------------------------------------- |
| <a id="type-parameter-t"></a> `T` | The expected type of the configuration value. |

#### Parameters

| Parameter | Type                | Description                  |
| --------- | ------------------- | ---------------------------- |
| `key`     | `IConfigKey`\<`T`\> | The typed configuration key. |

#### Returns

`T`

The typed configuration value.

#### Implementation of

[`ICompositionContext`](Interface.ICompositionContext).[`getConfigValue`](Interface.ICompositionContext#getconfigvalue)

---

### getService()

```ts
getService<T>(token): T;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L79)

Resolves a provider from the composition context.

#### Type Parameters

| Type Parameter                      | Description               |
| ----------------------------------- | ------------------------- |
| <a id="type-parameter-t-1"></a> `T` | The type of the provider. |

#### Parameters

| Parameter | Type                   | Description                                    |
| --------- | ---------------------- | ---------------------------------------------- |
| `token`   | new (...`args`) => `T` | The provider token (class, string, or symbol). |

#### Returns

`T`

The resolved provider instance.

#### Implementation of

[`ICompositionContext`](Interface.ICompositionContext).[`getService`](Interface.ICompositionContext#getservice)

---

### tryGetConfigValue()

```ts
tryGetConfigValue<T>(key, fallback): T;
```

Defined in: [libs/platform-bootstrap/src/composition/context/CompositionContext.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/CompositionContext.ts#L72)

Reads an optional configuration value with a fallback.

#### Type Parameters

| Type Parameter                      | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| <a id="type-parameter-t-2"></a> `T` | The expected type of the configuration value. |

#### Parameters

| Parameter  | Type                | Description                                |
| ---------- | ------------------- | ------------------------------------------ |
| `key`      | `IConfigKey`\<`T`\> | The typed configuration key.               |
| `fallback` | `T`                 | The fallback value when the key is absent. |

#### Returns

`T`

The typed configuration value or the fallback.

#### Implementation of

[`ICompositionContext`](Interface.ICompositionContext).[`tryGetConfigValue`](Interface.ICompositionContext#trygetconfigvalue)
