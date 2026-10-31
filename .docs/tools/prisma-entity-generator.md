---
title: Prisma Entity Generator
description: Generate strongly-typed TypeScript entity interfaces from your Prisma schema with support for naming conventions, namespace exports, and enum handling strategies.
order: 2
---

# Prisma Entity Generator

`@pixel-brewery/archipel-prisma-generator-entities` is a Prisma generator that produces strongly-typed TypeScript entity interfaces from your Prisma schema. It supports naming conventions, namespace-based exports, configurable enum handling, and readonly array types.

---

## Installation

Configure the `@pixel-brewery` GitHub Packages scope and authentication as
described in [Getting Started](/guides/getting-started#install-the-foundation)
before installing the generator.

```bash
yarn add @pixel-brewery/archipel-prisma-generator-entities
```

The generator depends on `@prisma/generator-helper` and `ts-morph` (bundled as dependencies).

### Prisma Compatibility

| Prisma Version | Status    |
| -------------- | --------- |
| 6.x            | Supported |
| 7.x            | Supported |

---

## Quick Start

Add the generator to your `schema.prisma`:

```prisma
generator entities {
  provider = "@pixel-brewery/archipel-prisma-generator-entities"
  output   = "./generated"
}
```

Run:

```bash
npx prisma generate
```

The generator creates an output directory with:

- An **index file** (`entities.ts`) that re-exports all generated types
- **Entity interface files** (e.g. `User.entity.ts`) for each Prisma model
- **Enum files** (e.g. `enums.ts`) for each Prisma enum (unless disabled)

---

## Configuration

All options are optional strings in the Prisma generator block.

| Option                              | Description                                                                 | Default          |
| ----------------------------------- | --------------------------------------------------------------------------- | ---------------- |
| `fileName`                          | Name of the barrel/index file that re-exports generated types               | `entities.ts`    |
| `entityFileSuffix`                  | Suffix appended to each entity file name                                    | `.entity.ts`     |
| `useReadonlyArray`                  | Emit list fields as `ReadonlyArray<T>` instead of mutable arrays            | `true`           |
| `generateModels`                    | Generate model entity interfaces                                            | `true`           |
| `generateEnums`                     | Generate enum definition files                                              | `true`           |
| `usePrismaEnumsWhenDisabled`        | Import enums from `@prisma/client` when `generateEnums` is `false`          | `true`           |
| `namespaceName`                     | Wrap all exports in a TypeScript namespace. Empty string = flat exports     | `""` (flat)      |
| `prismaClientImportPath`            | Import path for Prisma client enums when using `usePrismaEnumsWhenDisabled` | `@prisma/client` |
| `modelNamingConventionPrefix`       | Prefix added to model entity names (e.g. `I`)                               | `""`             |
| `modelNamingConventionSuffix`       | Suffix added to model entity names (e.g. `Entity`)                          | `""`             |
| `modelNamingConventionReplaceRegex` | Regex applied to model names for custom renaming                            | _(none)_         |
| `modelNamingConventionReplaceValue` | Replacement value used with the model regex                                 | _(none)_         |
| `enumNamingConventionPrefix`        | Prefix added to enum file names (e.g. `E`)                                  | `""`             |
| `enumNamingConventionSuffix`        | Suffix added to enum file names (e.g. `Enum`)                               | `""`             |
| `enumNamingConventionReplaceRegex`  | Regex applied to enum names for custom renaming                             | _(none)_         |
| `enumNamingConventionReplaceValue`  | Replacement value used with the enum regex                                  | _(none)_         |

Boolean options accept `true`, `false`, `yes`, `no`, `1`, `0`.

---

## Examples

### Basic usage with interface prefix

```prisma
generator entities {
  provider                      = "@pixel-brewery/archipel-prisma-generator-entities"
  output                        = "./generated"
  modelNamingConventionPrefix   = "I"
}
```

Given a model `User`, this produces `IUser.entity.ts`:

```typescript
export interface IUser {
    readonly id: string;
    readonly email: string;
    readonly roles: ReadonlyArray<Role>;
}
```

### Namespace exports

```prisma
generator entities {
  provider                      = "@pixel-brewery/archipel-prisma-generator-entities"
  output                        = "./generated"
  modelNamingConventionPrefix   = "I"
  modelNamingConventionSuffix   = "Entity"
  namespaceName                 = "Entities"
}
```

The barrel file wraps all exports in a namespace:

```typescript
import type { IUserEntity } from './IUserEntity.entity.js';
import * as _Role from './Role.js';

export namespace Entities {
    export import Role = _Role.Role;
    export type Role = _Role.Role;
    export type { IUserEntity };
}
```

Usage:

```typescript
import { Entities } from './generated.js';

type User = Entities.IUserEntity;
const role: Entities.Role = Entities.Role.ADMIN;
```

### Disabling enum generation

```prisma
generator entities {
  provider                    = "@pixel-brewery/archipel-prisma-generator-entities"
  output                      = "./generated"
  generateEnums               = "false"
  usePrismaEnumsWhenDisabled  = "true"
}
```

Entity interfaces import enum types from `@prisma/client` instead of generating them:

```typescript
import type { Role } from '@prisma/client';

export interface IUser {
    readonly id: string;
    readonly role: Role;
}
```

---

## Clean Generation

The generator performs a **clean generation** on every run — it deletes the output directory and recreates all files from scratch. This prevents stale files from renamed or deleted models.

Do not place hand-written files in the output directory.

---

## Type Mapping

| Prisma Type | TypeScript Type |
| ----------- | --------------- |
| `String`    | `string`        |
| `Int`       | `number`        |
| `Float`     | `number`        |
| `Decimal`   | `number`        |
| `BigInt`    | `bigint`        |
| `Boolean`   | `boolean`       |
| `DateTime`  | `Date`          |
| `Json`      | `unknown`       |
| `Bytes`     | `Buffer`        |

Nullable fields receive `| null`. List fields use `ReadonlyArray<T>` (or `T[]` when `useReadonlyArray` is `false`). Relations are typed as references to the related entity interface.
