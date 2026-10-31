---
title: 'Class: DatabaseModule'
generated: true
editUrl: false
---

# Class: DatabaseModule

Defined in: [libs/platform-database/src/DatabaseModule.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/DatabaseModule.ts#L53)

## Constructors

### Constructor

```ts
new DatabaseModule(): DatabaseModule;
```

#### Returns

`DatabaseModule`

## Methods

### forRoot()

```ts
static forRoot(config?): DynamicModule;
```

Defined in: [libs/platform-database/src/DatabaseModule.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/DatabaseModule.ts#L103)

Registers the `DatabaseModule` globally with the provided configuration.

Use this method when you need to configure a Prisma adapter (e.g. `PrismaPg`)
for Prisma 7+ compatibility.

#### Parameters

| Parameter | Type                                                       | Description                                             |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `config?` | [`IDatabaseModuleConfig`](Interface.IDatabaseModuleConfig) | The database module configuration including the adapter |

#### Returns

`DynamicModule`

A `DynamicModule` that can be imported globally

#### Example

```typescript
import { PrismaPg } from '@prisma/adapter-pg';

DatabaseModule.forRoot({
    adapter: new PrismaPg(connectionUrl),
});
```

---

### register()

```ts
static register(config?): DynamicModule;
```

Defined in: [libs/platform-database/src/DatabaseModule.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/DatabaseModule.ts#L122)

Registers the `DatabaseModule` with the provided configuration.

Use this method for non-global registration with a Prisma adapter.

#### Parameters

| Parameter | Type                                                       | Description                                             |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `config?` | [`IDatabaseModuleConfig`](Interface.IDatabaseModuleConfig) | The database module configuration including the adapter |

#### Returns

`DynamicModule`

A `DynamicModule` that can be imported
