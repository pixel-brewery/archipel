---
title: 'Interface: IPrismaServiceOptions'
generated: true
editUrl: false
---

# Interface: IPrismaServiceOptions

Defined in: [libs/platform-database/src/services/PrismaService.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L15)

Represents the options for the PrismaService.

## Properties

### adapter?

```ts
adapter?: unknown;
```

Defined in: [libs/platform-database/src/services/PrismaService.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L20)

A Prisma driver adapter instance (e.g. `PrismaPg`, `PrismaLibSQL`).
Required for Prisma 7+ with the new `prisma-client` generator.
