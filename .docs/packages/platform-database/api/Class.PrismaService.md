---
title: 'Class: PrismaService'
generated: true
editUrl: false
---

# Class: PrismaService

Defined in: [libs/platform-database/src/services/PrismaService.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L29)

Represents the prisma service.

## Extends

- `PrismaClient`

## Extended by

- [`DatabaseService`](Class.DatabaseService)

## Implements

- `OnModuleInit`
- `OnModuleDestroy`

## Indexable

```ts
[K: symbol]: {
}
```

## Constructors

### Constructor

```ts
new PrismaService(configService, options?): PrismaService;
```

Defined in: [libs/platform-database/src/services/PrismaService.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L43)

Constructs a new instance of the `PrismaService` class.

#### Parameters

| Parameter       | Type                                                       |
| --------------- | ---------------------------------------------------------- |
| `configService` | `ConfigService`                                            |
| `options?`      | [`IPrismaServiceOptions`](Interface.IPrismaServiceOptions) |

#### Returns

`PrismaService`

#### Overrides

`PrismaClient.constructor`

## Methods

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-database/src/services/PrismaService.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L69)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-database/src/services/PrismaService.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L58)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`
