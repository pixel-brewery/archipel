---
title: Migrating to v1
description: Migrate an Archipel application to the ESM-only NestJS 12 release.
order: 2
---

# Migrating to v1

Archipel v1 is an ESM-only release for NestJS 12. The public package names and
import subpaths remain stable, but the runtime, compiler, and peer-dependency
contracts change.

## Requirements

- Node.js 22.18.0 or newer
- NestJS 12 for all `@nestjs/*` runtime packages
- an ESM application package
- TypeScript configured with Node's ESM module resolution

Update related Nest packages together so that `@nestjs/common`,
`@nestjs/core`, the selected platform adapter, and optional integrations do not
resolve to mixed major versions.

## Enable ESM in the application

Declare the application package as ESM:

```json
{
    "type": "module"
}
```

Use NodeNext compilation semantics:

```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "target": "ES2023",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true
    }
}
```

The exact target can be raised for newer Node.js versions, but it must not be
lower than the APIs used by the application.

## Update source imports

Package imports do not change:

```typescript
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
```

Relative TypeScript imports need runtime `.js` extensions:

```typescript
import { APP_CONFIG_ENTRIES } from './env.js';
import { UserService } from './users/UserService.js';
```

Replace CommonJS runtime constructs as part of the same migration:

| CommonJS or legacy pattern   | ESM replacement                              |
| ---------------------------- | -------------------------------------------- |
| `require('package')`         | static `import` or `await import('package')` |
| `module.exports` / `exports` | `export` / `export default`                  |
| `__dirname`                  | `import.meta.dirname`                        |
| `__filename`                 | `import.meta.filename`                       |

## Intelligence package

`@pixel-brewery/archipel-platform-intelligence` no longer carries a CommonJS
compatibility bridge for the ESM-only Vercel AI SDK. Its `ai` and
`@ai-sdk/*` dependencies are loaded with native, statically traceable
`import()` calls. The provider-neutral `ai` runtime is imported directly where
it is used; no shared runtime loader remains. Existing Archipel provider
subpath imports remain unchanged; consumer applications still do not import
provider SDKs directly.

## Validate the migration

Run the application's regular checks and then start the compiled application
with Node.js, not only through a TypeScript development runner:

```bash
yarn nx run <api-project>:lint
yarn nx run <api-project>:test
yarn nx run <api-project>:build
node dist/<api-entry>.js
```

Exercise at least one HTTP request and any enabled Intelligence and MCP flows.
This catches runtime module-resolution problems that type checking alone cannot
detect.

## Release impact

ESM-only output, NestJS 12-only peer ranges, and the higher Node.js floor are
breaking changes. They therefore require a major release for every affected
fixed release group. Archipel's package versions and publishing remain under
the maintainer's release workflow; this migration does not publish artifacts.
