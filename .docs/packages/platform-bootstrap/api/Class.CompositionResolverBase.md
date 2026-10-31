---
title: 'Abstract Class: CompositionResolverBase'
generated: true
editUrl: false
---

# Abstract Class: CompositionResolverBase

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L42)

Abstract base class for composition-time feature resolution.

Applications extend this class to define their own composition logic,
determining which modules and providers should be imported based on
configuration, stage, or other criteria.

## Remarks

The resolver is instantiated within a lightweight composition context
before the main application module graph is built. It should only
depend on configuration and other composition-safe services.

Do not inject heavy infrastructure services (database, queues, etc.)
into the resolver as they are not available during composition.

## Example

```typescript
@Injectable()
export class AppCompositionResolver extends CompositionResolverBase {
    public constructor(configService: ConfigService) {
        super(configService);
    }

    public shouldImportSmtpMail(): boolean {
        const driver = this.tryGetConfigValue(MAIL_DRIVER, 'log');
        return driver === 'smtp' || this.isProductionLike();
    }

    public isProductionLike(): boolean {
        const stage = this.tryGetConfigValue(NODE_ENV, 'development');
        return stage === 'production' || stage === 'staging';
    }
}
```

## Constructors

### Constructor

```ts
protected new CompositionResolverBase(configService): CompositionResolverBase;
```

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L58)

Constructs a new composition resolver.

#### Parameters

| Parameter       | Type            | Description                                               |
| --------------- | --------------- | --------------------------------------------------------- |
| `configService` | `ConfigService` | The configuration service for reading environment values. |

#### Returns

`CompositionResolverBase`

## Accessors

### configService

#### Get Signature

```ts
get protected configService(): ConfigService;
```

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L71)

The underlying configuration service.

##### Returns

`ConfigService`

## Methods

### compareConfigValue()

```ts
protected compareConfigValue<T>(key, value): boolean;
```

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L129)

Compares a configuration value against an expected value.

#### Type Parameters

| Type Parameter                    | Description                                   |
| --------------------------------- | --------------------------------------------- |
| <a id="type-parameter-t"></a> `T` | The expected type of the configuration value. |

#### Parameters

| Parameter | Type                | Description                   |
| --------- | ------------------- | ----------------------------- |
| `key`     | `IConfigKey`\<`T`\> | The typed configuration key.  |
| `value`   | `T`                 | The value to compare against. |

#### Returns

`boolean`

`true` if the configuration value matches; otherwise, `false`.

---

### getConfigValue()

```ts
protected getConfigValue<T>(key): T;
```

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:101](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L101)

Gets a required configuration value.

#### Type Parameters

| Type Parameter                      | Description                                   |
| ----------------------------------- | --------------------------------------------- |
| <a id="type-parameter-t-1"></a> `T` | The expected type of the configuration value. |

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

### shouldImportProvider()

```ts
abstract shouldImportProvider(providerKey): boolean;
```

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:89](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L89)

Determines whether a specific provider should be imported.

Override this method to implement custom provider resolution logic.

#### Parameters

| Parameter     | Type     | Description                                                               |
| ------------- | -------- | ------------------------------------------------------------------------- |
| `providerKey` | `string` | A unique key identifying the provider (e.g., `'mail'`, `'blob-storage'`). |

#### Returns

`boolean`

`true` if the provider should be imported; otherwise, `false`.

---

### tryGetConfigValue()

```ts
protected tryGetConfigValue<T>(key, fallback): T;
```

Defined in: [libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts:115](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/services/abstracts/CompositionResolverBase.ts#L115)

Gets an optional configuration value with a fallback.

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
