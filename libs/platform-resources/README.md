# @pixel-brewery/archipel-platform-resources

Multi-strategy resource management for NestJS with file system, blob storage, and embedded buffer support.

## Features

- **Pluggable strategies** — File system, blob storage, or embedded buffers
- **MIME type detection** — Automatic via the `mime-types` library
- **Optional caching** — Integrates with `@pixel-brewery/archipel-platform-caching`
- **NestJS integration** — Global `ResourceModule.forRoot()` with injectable `ResourceManager`

## Quick Start

```typescript
import { ResourceModule, ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { FileResourceStrategy } from '@pixel-brewery/archipel-platform-resources';

@Module({
    imports: [
        ResourceModule.forRoot({
            strategies: [new FileResourceStrategy({ basePath: './assets' })],
        }),
    ],
})
export class AppModule {}
```

## Supported Strategies

| Strategy                   | Description                                                     |
| -------------------------- | --------------------------------------------------------------- |
| `FileResourceStrategy`     | Loads resources from the local file system with glob support    |
| `BlobResourceStrategy`     | Loads resources from a blob storage adapter (Vercel, Azure, S3) |
| `EmbeddedResourceStrategy` | Serves pre-loaded in-memory buffers                             |

## Import Options

```typescript
// Main import
import { ResourceModule, ResourceManager } from '@pixel-brewery/archipel-platform-resources';

// Strategy-specific (tree-shakable sub-exports)
import { FileResourceStrategy } from '@pixel-brewery/archipel-platform-resources/file';
import { BlobResourceStrategy } from '@pixel-brewery/archipel-platform-resources/blob';
import { EmbeddedResourceStrategy } from '@pixel-brewery/archipel-platform-resources/embedded';
```

## Error Handling

| Error Class             | When Thrown                       |
| ----------------------- | --------------------------------- |
| `ResourceNotFoundError` | Requested resource does not exist |

## Resource Limits

| Limit            | Value      | Description                                       |
| ---------------- | ---------- | ------------------------------------------------- |
| Strategy timeout | 30 seconds | `ResourceManager` aborts strategy calls after 30s |

## Peer Dependencies

| Package                                    | Required | Notes                    |
| ------------------------------------------ | -------- | ------------------------ |
| `@pixel-brewery/archipel-platform-caching` | No       | Optional caching support |
| `@nestjs/common`                           | Yes      | NestJS core              |
| `glob`                                     | Yes      | File glob matching       |
| `mime-types`                               | Yes      | MIME type detection      |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-resources/index.md`](../../.docs/packages/platform-resources/index.md)

## Development

```bash
# Build
yarn nx build platform-resources

# Test
yarn nx test platform-resources

# Lint
yarn nx lint platform-resources
```
