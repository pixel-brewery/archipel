# @pixel-brewery/archipel-prisma-generator-entities

Prisma generator for strongly-typed TypeScript entity interfaces.

> [!IMPORTANT]
> This package is hosted on GitHub Packages. Configure the `@pixel-brewery` scope
> and a GitHub personal access token (classic) with `read:packages` permission
> before installing it. See the
> [package access setup](../../.docs/guides/getting-started.md#install-the-foundation).

## Installation

```bash
yarn add @pixel-brewery/archipel-prisma-generator-entities
```

## Quick Start

Add to `schema.prisma`:

```prisma
generator entities {
  provider = "@pixel-brewery/archipel-prisma-generator-entities"
  output   = "./generated"
  fileName = "entities.ts"
}
```

**With namespace support:**

```prisma
generator entities {
  provider                    = "@pixel-brewery/archipel-prisma-generator-entities"
  output                      = "./generated"
  fileName                    = "index.ts"
  modelNamingConventionPrefix = "I"
  modelNamingConventionSuffix = "Entity"
  generateEnums               = "false"
  usePrismaEnumsWhenDisabled  = "true"
  namespaceName               = "Entities"  // Leave empty "" for flat exports
}
```

Run: `prisma generate`

### Local Development (Monorepo)

When developing inside the Archipel monorepo, use a relative path to the built output instead:

```prisma
generator entities {
  provider = "node ../../dist/tools/prisma-generator-entities/src/bin.js"
  output   = "./generated"
}
```

## Prisma Compatibility

| Prisma Version | Status    |
| -------------- | --------- |
| 6.x            | Supported |
| 7.x            | Supported |

**Note**: The generator performs a **clean generation** - it completely removes and recreates the output directory on each run. This prevents stale files from renamed or deleted models/enums.

## Documentation

📖 **Full documentation:** [`.docs/tools/prisma-entity-generator.md`](../../.docs/tools/prisma-entity-generator.md)

Topics covered:

- Configuration options
- Entity interface generation
- Enum handling
- TypeScript type safety features

## Configuration

| Option                       | Description                                                                                        | Default                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------- |
| `fileName`                   | Index file that re-exports the generated entities and enums                                        | `entities.ts`                    |
| `entityFileSuffix`           | File name suffix appended to each entity file                                                      | `.entity.ts`                     |
| `useReadonlyArray`           | Emits list fields as `ReadonlyArray<T>` instead of mutable arrays                                  | `true`                           |
| `generateModels`             | Generate model entity interfaces                                                                   | `true`                           |
| `generateEnums`              | Generate enum files                                                                                | `true`                           |
| `usePrismaEnumsWhenDisabled` | Import enums from `@prisma/client` when `generateEnums` is false                                   | `true`                           |
| `namespaceName`              | Wrap all exports in a namespace with this name. Leave empty for flat exports.                      | `""` (empty, no namespace)       |
| `modelNamingConvention`      | JSON string describing prefix, suffix, and optional regex replacements for model entity file names | `{ "prefix": "", "suffix": "" }` |
| `enumNamingConvention`       | JSON string describing prefix, suffix, and optional regex replacements for enum module file names  | `{ "prefix": "", "suffix": "" }` |

All options are optional and can be provided as strings in the Prisma generator configuration. Naming conventions must be encoded as JSON strings inside the Prisma schema.

### Enum Handling Strategy

When `generateEnums` is set to `false`, the generator provides two behaviors:

1. **With `usePrismaEnumsWhenDisabled: true` (default, recommended)**:
    - Entity interfaces import enum types from `@prisma/client`
    - Ensures type safety without duplicating enum definitions
    - Example:

        ```typescript
        import type { Role } from '@prisma/client';

        export interface IUserEntity {
            readonly id: string;
            readonly role: Role; // ✅ Uses Prisma-generated enum
        }
        ```

2. **With `usePrismaEnumsWhenDisabled: false` (legacy)**:
    - No enum imports are added
    - Entity interfaces reference enum types that don't exist
    - ❌ **Will cause TypeScript compilation errors**
    - Only use if you provide enum definitions manually

**Recommendation**: Always use `usePrismaEnumsWhenDisabled: true` when disabling enum generation.

## Namespace Export Strategy

When `namespaceName` is provided (non-empty string), the generator wraps all exports in a namespace:

**With `namespaceName: ""` (default - flat exports)**:

```typescript
// index.ts
export type { IUser } from './IUser.entity.js';
export type { IProduct } from './IProduct.entity.js';
export * from './Role.js';

// Usage
import { IUser, Role } from './generated.js';
```

**With `namespaceName: "Entities"` (namespace mode)**:

```typescript
// index.ts
import type { IUser } from './IUser.entity.js';
import type { IProduct } from './IProduct.entity.js';
import * as _Role from './Role.js';

export namespace Entities {
    export import Role = _Role.Role;
    export type Role = _Role.Role;

    export type { IUser };
    export type { IProduct };
}

// Usage
import { Entities } from './generated.js';
type User = Entities.IUser;
const role: Entities.Role = Entities.Role.ADMIN;
```

**Benefits of namespace mode**:

- ✅ Clear separation from other imports
- ✅ Prevents naming conflicts in large codebases
- ✅ Single import statement for all entities
- ✅ Explicit API surface (e.g., `Entities.IUser`)

**When to use**:

- Large projects with many entities (50+ models)
- When mixing multiple generated sources
- When you want to avoid module scope pollution
- When you prefer explicit prefixes for generated types

## Clean Generation

The generator performs a **clean generation** on every run:

1. **Deletes** the entire output directory
2. **Recreates** the directory structure
3. **Generates** all files fresh from the current schema

**Benefits**:

- ✅ No stale files from renamed models
- ✅ No leftover enum files when `generateEnums: false`
- ✅ Output always reflects current schema state
- ✅ Prevents import errors from deleted entities

**Important**: Do not manually add files to the output directory - they will be deleted on the next generation.
