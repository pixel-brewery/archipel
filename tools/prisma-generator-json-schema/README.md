# @pixel-brewery/archipel-prisma-generator-json-schema

Prisma generator for JSON Schema validation documents.

> [!IMPORTANT]
> This package is hosted on GitHub Packages. Configure the `@pixel-brewery` scope
> and a GitHub personal access token (classic) with `read:packages` permission
> before installing it. See the
> [package access setup](../../.docs/guides/getting-started.md#install-the-foundation).

## Installation

```bash
yarn add @pixel-brewery/archipel-prisma-generator-json-schema
```

## Quick Start

Add to `schema.prisma`:

```prisma
generator jsonSchema {
  provider = "@pixel-brewery/archipel-prisma-generator-json-schema"
  output   = "./generated"
  fileName = "manifest.json"
}
```

Run: `prisma generate`

### Local Development (Monorepo)

When developing inside the Archipel monorepo, use a relative path to the built output instead:

```prisma
generator jsonSchema {
  provider = "node ../../dist/tools/prisma-generator-json-schema/src/bin.js"
  output   = "./generated"
}
```

## Prisma Compatibility

| Prisma Version | Status    |
| -------------- | --------- |
| 6.x            | Supported |
| 7.x            | Supported |

## Documentation

📖 **Full documentation:** [`.docs/tools/prisma-json-schema-generator.md`](../../.docs/tools/prisma-json-schema-generator.md)

Topics covered:

- Configuration options
- JSON Schema generation
- Model and enum references
- Validation rules

## Configuration

| Option                  | Description                                                                                        | Default                          |
| ----------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------- |
| `fileName`              | Manifest file that references the generated schemas                                                | `manifest.json`                  |
| `schemaFileSuffix`      | File name suffix appended to each schema file                                                      | `.schema.json`                   |
| `schemaVersion`         | JSON Schema draft URI assigned to generated schemas                                                | `https://json-schema.org/schema` |
| `emitGeneratorComment`  | Adds a `$comment` metadata entry to each generated schema                                          | `true`                           |
| `modelNamingConvention` | JSON string describing prefix, suffix, and optional regex replacements for model schema file names | `{ "prefix": "", "suffix": "" }` |
| `enumNamingConvention`  | JSON string describing prefix, suffix, and optional regex replacements for enum schema file names  | `{ "prefix": "", "suffix": "" }` |

All options are optional and can be provided as strings in the Prisma generator configuration. Complex objects, such as naming
conventions, must be encoded as JSON strings within the Prisma schema configuration block.
