---
title: 'Interface: ICreateWithCompositionOptions\<TApplication\>'
generated: true
editUrl: false
---

# Interface: ICreateWithCompositionOptions\<TApplication\>

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L22)

Options for creating a composed application.

## Type Parameters

| Type Parameter                                                                       | Default type       |
| ------------------------------------------------------------------------------------ | ------------------ |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication` | `INestApplication` |

## Properties

### adapter?

```ts
readonly adapter?: unknown;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L70)

Custom HTTP adapter to use.

#### Example

```typescript
import { ExpressAdapter } from '@nestjs/platform-express';

const builder = await PlatformApplicationBuilder.createWithComposition({
    adapter: new ExpressAdapter(),
    // ...
});
```

---

### appFactory?

```ts
readonly appFactory?: (composedModule) => Promise<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L91)

Factory function that creates the application type.

If provided, this takes precedence over the default `NestFactory.create()` call.
Use this for custom application types or adapters.

#### Parameters

| Parameter        | Type            |
| ---------------- | --------------- |
| `composedModule` | `DynamicModule` |

#### Returns

`Promise`\<`TApplication`\>

#### Example

```typescript
const builder = await PlatformApplicationBuilder.createWithComposition({
    appFactory: (module) => NestFactory.create<NestExpressApplication>(module, new ExpressAdapter()),
    // ...
});
```

---

### compositionModule?

```ts
readonly compositionModule?: Type<unknown>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L30)

Custom composition module that provides the composition services.

If not provided, the default [CompositionModule](Class.CompositionModule) is used.

---

### enableCompositionLogging?

```ts
readonly enableCompositionLogging?: boolean;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L39)

Whether to enable logging for the composition context.

Defaults to `false`.

---

### nestOptions?

```ts
readonly nestOptions?: NestApplicationOptions;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L46)

NestJS application options passed to `NestFactory.create()`.

---

### platformOptions?

```ts
readonly platformOptions?: IPlatformApplicationOptions;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplicationBuilder.ts#L53)

Platform application options for the builder.
