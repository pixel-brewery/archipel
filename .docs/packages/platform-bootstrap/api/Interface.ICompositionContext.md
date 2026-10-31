---
title: 'Interface: ICompositionContext'
generated: true
editUrl: false
---

# Interface: ICompositionContext

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L35)

Pre-bootstrap context for stage-aware module composition.

This context is created before the main application module graph is built.
It provides access to configuration and lightweight composition services
that help determine which modules should be dynamically imported.

## Remarks

The composition context uses a temporary NestJS application context internally.
This context must be closed after the real application has been created by
calling [ICompositionContext.close](#close).

## Example

```typescript
const composition = await createCompositionContext();

try {
    const appModule = await createAppModule(composition);
    const app = await NestFactory.create(appModule);
    await app.listen(3000);
} finally {
    await composition.close();
}
```

## Properties

### config

```ts
readonly config: ConfigService;
```

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L53)

The Archipel configuration service.

Provides typed access to environment configuration values.

---

### context

```ts
readonly context: INestApplicationContext;
```

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L44)

The temporary NestJS application context.

Used only for dependency injection resolution during composition.
Do not use this context for runtime services.

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:100](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L100)

Closes the temporary composition context.

Must be called after the real application has been created to release
resources held by the composition context.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the context is closed.

---

### getConfigValue()

```ts
getConfigValue<T>(key): T;
```

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L65)

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

#### Throws

When the configuration key is not found.

---

### getService()

```ts
getService<T>(token): T;
```

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L88)

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

---

### tryGetConfigValue()

```ts
tryGetConfigValue<T>(key, fallback): T;
```

Defined in: [libs/platform-bootstrap/src/composition/context/ICompositionContext.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/context/ICompositionContext.ts#L77)

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
