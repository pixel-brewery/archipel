<p align="center">
  <img src=".github/assets/archipel-hero-v2.png" alt="Archipel — connected modular islands in light ceramic and glass" width="1200" />
</p>

# Archipel

**Build different backends on one shared foundation.**

Archipel turns recurring backend work into reusable NestJS packages. Carry the same architecture,
infrastructure and integration patterns across applications, so each new project starts with
familiar tools and consistent behavior.

![Node.js 22.18+](https://img.shields.io/badge/Node.js-22.18%2B-417E38?style=flat-square)
![Native ESM](https://img.shields.io/badge/modules-native_ESM-263445?style=flat-square)
[![CI](https://github.com/pixel-brewery/archipel/actions/workflows/ci.yml/badge.svg)](https://github.com/pixel-brewery/archipel/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-E87939?style=flat-square)](LICENSE)

[Get started](#get-started) · [Packages](#packages) · [Documentation](#documentation) · [Build from source](#build-from-source) · [Contribute](#contribute)

## Why Archipel exists

Archipel grew out of building different applications whose backends kept needing the same
architecture and capabilities. Configuration, database access, identity and integrations returned
in every project, along with the work of making those pieces fit together consistently.

That common foundation lives here as reusable NestJS packages. Each backend gets familiar
contracts and patterns for how it is assembled, configured and extended. The application keeps
its own entities, authorization decisions and workflows.

- **Start from an established architecture.** Reuse shared capabilities and their integration
  patterns as the starting point for the next backend.
- **Work consistently across applications.** Shared configuration and extension contracts mean
  fewer project-specific conventions to learn when developing, maintaining or operating another backend.
- **Improve a capability once.** Adopt the same package fixes and improvements across the
  applications that use it.

Abstract base classes serve as both contracts and dependency-injection tokens. Built-in provider
adapters and application-owned implementations use those same contracts. Provider-specific
entry points let you select an integration together with its SDK dependencies.

## Get started

Use **Node.js 22.18.0 or newer**, **NestJS 12** and native ESM. Your application should
declare `"type": "module"` and use TypeScript's `NodeNext` module and module-resolution
settings. See the [getting-started guide](.docs/guides/getting-started.md) for the complete setup.

### Configure package access

The source is MIT licensed. npm packages are distributed through **GitHub Packages** under
`@pixel-brewery`, at `npm.pkg.github.com`. Registry authentication is required even for public
GitHub npm packages.

For Yarn 4, add this scope to your application's `.yarnrc.yml`:

```yaml
npmScopes:
    pixel-brewery:
        npmRegistryServer: 'https://npm.pkg.github.com'
        npmAlwaysAuth: true
        npmAuthToken: '${NODE_AUTH_TOKEN}'
```

Export a GitHub personal access token (classic) with `read:packages` permission as `NODE_AUTH_TOKEN`,
then install the capabilities you need. To start with configuration:

```sh
yarn add @pixel-brewery/archipel-platform-configuration
```

### Register a module

Bootstrap the global configuration service once in your application's root module:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: () => new EnvironmentConfigStrategy(),
        }),
    ],
})
export class AppModule {}
```

Features declare their typed keys with `createConfigKey<T>()` and register their requirements
through `ConfigModule.register()`. The [configuration guide](.docs/guides/configuration.md)
covers keys, defaults, environment variables, file-based strategies and discovery.

## Packages

Archipel contains **28 packages: 25 backend libraries, one documentation MCP server and two
Prisma generators**. Backend package names follow `@pixel-brewery/archipel-platform-*`.

| Category               | Capabilities                                                                                     | Start here                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Foundation**         | Application composition, configuration, Prisma repositories, mapping and cryptographic utilities | [Configuration](libs/platform-configuration/README.md), [Database](libs/platform-database/README.md)        |
| **Identity & access**  | Authentication, sessions, MFA, payments and feature flags                                        | [Authentication](libs/platform-authentication/README.md), [Payments](libs/platform-payments/README.md)      |
| **Infrastructure**     | File storage, resources, caching, queues, email, documents and e-signatures                      | [Queues](libs/platform-queue/README.md), [Blob storage](libs/platform-blob-storage/README.md)               |
| **Operations**         | Health, logging, analytics, telemetry, OpenAPI, reporting and application MCP support            | [Telemetry](libs/platform-telemetry/README.md), [MCP](libs/platform-mcp/README.md)                          |
| **AI & extensibility** | Provider-neutral intelligence APIs, realtime sessions, tools and agent coordination              | [Intelligence](libs/platform-intelligence/README.md), [Agents](libs/platform-intelligence-agents/README.md) |

The [package catalog](.docs/packages/index.md) links the full library set and generated API
reference. Each package README documents its imports, configuration and provider options.

### Developer tools

| Package                                                                                 | Purpose                                                                            |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`archipel-mcp`](tools/mcp/README.md)                                                   | Bundled package documentation, guides and patterns for coding tools over MCP stdio |
| [`archipel-prisma-generator-entities`](tools/prisma-generator-entities/README.md)       | TypeScript entity interfaces generated from a Prisma schema                        |
| [`archipel-prisma-generator-json-schema`](tools/prisma-generator-json-schema/README.md) | JSON Schema documents generated from a Prisma schema                               |

All three use the `@pixel-brewery/` npm scope. See the [tool guides](.docs/tools/index.md) for
installation and integration.

## Documentation

Browse the [documentation website](https://pixel-brewery.github.io/archipel/) or read the
same guides alongside the source:

- [Getting started](.docs/guides/getting-started.md) — installation and application composition
- [API reference](.docs/api/index.md) — generated classes, interfaces, functions and configuration keys
- [Configuration and environment variables](.docs/guides/configuration.md) — registration, resolution and discovery
- [Architecture](.docs/architecture/index.md) — library boundaries and extension contracts
- [Guides](.docs/guides/index.md) and [patterns](.docs/patterns/index.md) — integration walkthroughs and reusable implementation patterns
- [Release guide](.docs/guides/releases.md) — versioning, publication, verification and recovery

## Build from source

The workspace pins **Yarn 4.13.0** and uses **Nx 24** with **NestJS 12**.

```sh
git clone https://github.com/pixel-brewery/archipel.git
cd archipel
corepack enable
yarn install --immutable
yarn run verify
```

Run `yarn run verify` before committing or pushing. It generates the Prisma client and
documentation artifacts, builds the documentation site, formats the workspace and runs
the agent, public-source, workflow, lint, test, spelling, build, type and package checks.
Commit the refreshed API references and search index with your changes. GitHub Actions
uses `yarn run verify:ci` to check formatting and run the same verification. For focused
work, use the owning Nx project:

```sh
yarn nx run platform-configuration:test --parallel=1 --maxWorkers=1
yarn docs:dev
```

## Contribute

Read the [repository engineering guide](AGENTS.md) for architecture, source conventions and
verification. Use Conventional Commits and pull requests; required checks must pass before
merging into `main`.

Verified source merges request automatic patch releases through GitHub Actions. The
[release guide](.docs/guides/releases.md) explains the two release groups, immutable package
versions and release artifacts. Release automation owns version preparation and publication.

## License

[MIT](LICENSE).
