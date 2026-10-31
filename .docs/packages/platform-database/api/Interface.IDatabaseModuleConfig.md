---
title: 'Interface: IDatabaseModuleConfig'
generated: true
editUrl: false
---

# Interface: IDatabaseModuleConfig

Defined in: [libs/platform-database/src/DatabaseModule.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/DatabaseModule.ts#L15)

Represents the database module configuration.

## Properties

### adapter?

```ts
adapter?: unknown;
```

Defined in: [libs/platform-database/src/DatabaseModule.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/DatabaseModule.ts#L20)

A Prisma driver adapter instance (e.g. `PrismaPg`, `PrismaLibSQL`).
Required for Prisma 7+ with the new `prisma-client` generator.

---

### middlewares?

```ts
middlewares?: unknown[];
```

Defined in: [libs/platform-database/src/DatabaseModule.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/DatabaseModule.ts#L22)

Future extension point for Prisma middlewares
