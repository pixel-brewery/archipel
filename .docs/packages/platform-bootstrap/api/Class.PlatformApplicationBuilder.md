---
title: 'Class: PlatformApplicationBuilder\<TApplication\>'
generated: true
editUrl: false
---

# Class: PlatformApplicationBuilder\<TApplication\>

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:99](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L99)

Fluent builder that composes NestJS bootstrap steps and executes them once.

## Type Parameters

| Type Parameter                                                                       | Default type       |
| ------------------------------------------------------------------------------------ | ------------------ |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication` | `INestApplication` |

## Constructors

### Constructor

```ts
new PlatformApplicationBuilder<TApplication>(app, options?): PlatformApplicationBuilder<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L111)

#### Parameters

| Parameter  | Type                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `app`      | `TApplication`                                                         |
| `options?` | [`IPlatformApplicationOptions`](Interface.IPlatformApplicationOptions) |

#### Returns

`PlatformApplicationBuilder`\<`TApplication`\>

## Accessors

### app

#### Get Signature

```ts
get app(): TApplication;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:205](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L205)

The wrapped NestJS application.

##### Returns

`TApplication`

## Methods

### createWithComposition()

```ts
static createWithComposition<TApp>(composer, options?): Promise<PlatformApplicationBuilder<TApp>>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:163](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L163)

Creates a new application builder using composition-based module assembly.

This factory bootstraps a lightweight composition context to read configuration
values, then invokes the provided composer function to determine which modules
to import. The resulting modules are assembled into a dynamic root module
and a NestJS application is created from it.

The composition context is automatically closed after the composer function completes.

#### Type Parameters

| Type Parameter                                                                | Default type                | Description                                                |
| ----------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------- |
| <a id="type-parameter-tapp"></a> `TApp` _extends_ `INestApplication`\<`any`\> | `INestApplication`\<`any`\> | The NestJS application type. Defaults to INestApplication. |

#### Parameters

| Parameter  | Type                                                                                                                                        | Description                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `composer` | (`context`) => \| [`CompositionImport`](TypeAlias.CompositionImport)[] \| `Promise`\<[`CompositionImport`](TypeAlias.CompositionImport)[]\> | A function that receives the composition context and returns an array of modules to import. |
| `options?` | [`ICreateWithCompositionOptions`](Interface.ICreateWithCompositionOptions)\<`TApp`\>                                                        | Options for creating the composed application.                                              |

#### Returns

`Promise`\<`PlatformApplicationBuilder`\<`TApp`\>\>

A promise that resolves to a configured PlatformApplicationBuilder.

#### Example

```typescript
import { PlatformApplicationBuilder } from '@pixel-brewery/archipel-platform-bootstrap';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

const builder = await PlatformApplicationBuilder.createWithComposition<NestExpressApplication>(
    async (context) => {
        const imports: CompositionImport[] = [AppModule];

        const driver = context.tryGetConfigValue({ key: 'MAIL_DRIVER' }, 'log');
        if (driver === 'smtp') {
            const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
            const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
            imports.push(MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy }));
        }

        return imports;
    },
    {
        appFactory: (module) => NestFactory.create<NestExpressApplication>(module, new ExpressAdapter()),
    },
);

await builder.use(useApi({ prefix: 'api' })).listenFromConfig({ fallbackPort: 3000 });
```

---

### initialize()

```ts
initialize(): Promise<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:231](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L231)

Executes the configured bootstrap pipeline and initializes the NestJS application.

#### Returns

`Promise`\<`TApplication`\>

The wrapped NestJS application.

---

### listen()

```ts
listen(port, hostname?): Promise<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:255](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L255)

Executes the pipeline and starts the NestJS listener on the given port.

#### Parameters

| Parameter   | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| `port`      | `number` | The HTTP port.                       |
| `hostname?` | `string` | Optional hostname/interface binding. |

#### Returns

`Promise`\<`TApplication`\>

The wrapped NestJS application.

---

### listenFromConfig()

```ts
listenFromConfig(options?): Promise<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:274](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L274)

Executes the pipeline and starts the listener using typed configuration keys.

#### Parameters

| Parameter  | Type                                                         | Description              |
| ---------- | ------------------------------------------------------------ | ------------------------ |
| `options?` | [`IPlatformListenOptions`](Interface.IPlatformListenOptions) | Port resolution options. |

#### Returns

`Promise`\<`TApplication`\>

The wrapped NestJS application.

---

### run()

```ts
run(): Promise<PlatformBootstrapContext<TApplication>>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:243](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L243)

Executes the configured bootstrap pipeline without starting a listener.

#### Returns

`Promise`\<[`PlatformBootstrapContext`](Class.PlatformBootstrapContext)\<`TApplication`\>\>

The bootstrap context used for the execution.

---

### use()

```ts
use(step): this;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:220](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L220)

Adds a bootstrap step to the application pipeline.

#### Parameters

| Parameter | Type                                                                         | Description                           |
| --------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| `step`    | [`PlatformBootstrapStep`](TypeAlias.PlatformBootstrapStep)\<`TApplication`\> | The step to execute during bootstrap. |

#### Returns

`this`

The current builder for chaining.
