---
title: Resource Management
description: Register and load files (templates, assets, configs) from disk, blob storage, or memory using the strategy-based ResourceManager.
order: 17
---

# Resource Management

This guide covers working with `ResourceManager` from `platform-resources`: registering file strategies, loading resources at runtime, and using the built-in caching layer. If your application ships email templates, HTML pages, CSS/JS assets, or any other file-based content, this is how you make it available to services.

---

## Installation

`ResourceManager` is part of `platform-resources`.

```bash
yarn add @pixel-brewery/archipel-platform-resources
```

---

## Overview: Strategy Pattern

`ResourceManager` does not load files directly. It delegates to one or more **strategies**, tried in priority order. The first strategy that can resolve the key wins.

| Strategy                   | Source             | Sync | Async | When to use                            |
| -------------------------- | ------------------ | ---- | ----- | -------------------------------------- |
| `FileResourceStrategy`     | Local filesystem   | Yes  | Yes   | Templates, assets bundled with the app |
| `BlobResourceStrategy`     | Cloud blob storage | No   | Yes   | User-uploaded templates, dynamic files |
| `EmbeddedResourceStrategy` | In-memory map      | Yes  | Yes   | Fallback content, test fixtures        |

Strategies are evaluated in the order you provide them. A typical setup:

```
FileResourceStrategy → BlobResourceStrategy → EmbeddedResourceStrategy
```

If the file exists on disk, it's served immediately. If not, blob storage is checked. If that also misses, the embedded fallback is returned. If nothing matches, a `ResourceNotFoundError` is thrown.

---

## Module Registration

`ResourceModule` is a global module. Register it once in your root module with `forRoot()`:

```typescript
import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { ResourceModule, FileResourceStrategy, EmbeddedResourceStrategy } from '@pixel-brewery/archipel-platform-resources';

@Module({
    imports: [
        ResourceModule.forRoot({
            strategies: [
                new FileResourceStrategy({
                    basePaths: [
                        join(import.meta.dirname, 'assets'),
                        join(import.meta.dirname, '..', 'node_modules', '@pixel-brewery', 'archipel-platform-resources', 'assets'),
                        join(import.meta.dirname, '..', 'node_modules', '@pixel-brewery', 'archipel-platform-openapi', 'assets'),
                        join(import.meta.dirname, '..', 'node_modules', '@pixel-brewery', 'archipel-platform-mailing', 'assets'),
                    ],
                    includeSubfolders: true,
                }),
                new EmbeddedResourceStrategy({
                    'fallback.html': '<html><body>Service unavailable</body></html>',
                }),
            ],
            debug: false,
        }),
    ],
})
export class AppModule {}
```

### Configuration Options

| Option       | Type                                     | Default | Description                                      |
| ------------ | ---------------------------------------- | ------- | ------------------------------------------------ |
| `strategies` | `IResourceStrategy[]`                    | —       | Strategies in priority order. Required.          |
| `cache`      | `ILayeredCache<string, IResourceResult>` | —       | Optional cache instance from `platform-caching`. |
| `cacheTtl`   | `number` (seconds)                       | `3600`  | TTL for cached resources.                        |
| `debug`      | `boolean`                                | `false` | Log all available resources on startup.          |

---

## Loading Resources

Inject `ResourceManager` and call its load methods. Every method has a `try*` variant that returns `undefined` instead of throwing.

```typescript
import { Injectable } from '@nestjs/common';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';

@Injectable()
export class InvoiceService {
    private readonly _resourceManager: ResourceManager;

    constructor(resourceManager: ResourceManager) {
        this._resourceManager = resourceManager;
    }

    public async generateInvoice(): Promise<string> {
        // Load an HTML template as string
        const template = await this._resourceManager.loadAsStringAsync('invoice-template.html');

        // ... fill template with data
        return template;
    }
}
```

### Method Reference

| Method                    | Returns                                 | Throws on miss | Notes                         |
| ------------------------- | --------------------------------------- | -------------- | ----------------------------- |
| `load(key)`               | `IResourceResult`                       | Yes            | Sync                          |
| `tryLoad(key)`            | `IResourceResult \| undefined`          | No             | Sync                          |
| `loadAsync(key)`          | `Promise<IResourceResult>`              | Yes            | Required for blob strategy    |
| `tryLoadAsync(key)`       | `Promise<IResourceResult \| undefined>` | No             |                               |
| `loadAsString(key, enc?)` | `string`                                | Yes            | Defaults to `utf-8`           |
| `loadAsStringAsync(key)`  | `Promise<string>`                       | Yes            |                               |
| `loadAsBuffer(key)`       | `Buffer \| undefined`                   | No             |                               |
| `loadAsBufferAsync(key)`  | `Promise<Buffer \| undefined>`          | No             |                               |
| `exists(key)`             | `boolean`                               | —              | Sync                          |
| `existsAsync(key)`        | `Promise<boolean>`                      | —              |                               |
| `invalidate(key)`         | `void`                                  | —              | Clears cache for key          |
| `invalidateAsync(key)`    | `Promise<void>`                         | —              |                               |
| `whatDoIHave()`           | `void`                                  | —              | Logs all resources to console |

### The `IResourceResult` Object

When you use the full `load()` / `tryLoad()` methods you get rich metadata alongside the content:

```typescript
interface IResourceResult {
    content: Buffer;
    metadata: IResourceMetadata;
}

interface IResourceMetadata {
    key: string; // Resource identifier you requested
    path: string; // Resolved file / blob path
    mimeType: string; // e.g. 'text/html', 'application/pdf'
    size: number; // Size in bytes
    encoding?: string; // e.g. 'utf-8'
    source: string; // Strategy name that resolved it (e.g. 'file')
    cachedAt?: Date; // Present when served from cache
}
```

---

## Strategy Details

### FileResourceStrategy

Searches one or more base paths on the filesystem. Each path is tried in order. If `includeSubfolders` is enabled, a recursive glob search runs as fallback when the direct lookup misses.

```typescript
new FileResourceStrategy({
    basePaths: [join(import.meta.dirname, 'assets'), join(import.meta.dirname, 'templates')],
    includeSubfolders: true,
    defaultEncoding: 'utf-8',
});
```

The key you pass to `load()` is the **filename** (e.g. `'invoice-template.html'`). The strategy joins it with each base path and checks if the file exists.

### BlobResourceStrategy

Loads from cloud blob storage via a minimal `IBlobServiceAdapter` interface. This is **async-only** — calling `load()` (sync) will throw.

```typescript
import { BlobResourceStrategy, IBlobServiceAdapter } from '@pixel-brewery/archipel-platform-resources';

const blobAdapter: IBlobServiceAdapter = {
    async downloadFile(key: string) {
        // Your blob storage client logic here
        return { data: buffer, contentType: 'text/html' };
    },
};

new BlobResourceStrategy(blobAdapter, {
    keyPrefix: 'templates/',
});
```

With `keyPrefix: 'templates/'`, a call to `loadAsync('invoice.html')` resolves to the blob key `templates/invoice.html`.

### EmbeddedResourceStrategy

Stores resources as plain strings in memory. Useful for fallback content or test fixtures.

```typescript
new EmbeddedResourceStrategy({
    'maintenance.html': '<h1>We are down for maintenance</h1>',
    'default-logo.svg': '<svg>...</svg>',
});
```

You can also register resources dynamically after construction:

```typescript
const embedded = new EmbeddedResourceStrategy();
embedded.register('dynamic-content.txt', 'Hello World');
```

---

## Real-World Examples

### Email Templates

`platform-mailing` uses `ResourceManager` to load HTML email templates:

```typescript
// In MailModule.ts — factory creates the strategy
ResourceModule.forRoot({
    strategies: [
        new FileResourceStrategy({
            basePaths: [
                join(import.meta.dirname, 'assets'), // App-level overrides
                join(import.meta.dirname, '..', 'node_modules', '@pixel-brewery', 'archipel-platform-mailing', 'assets'),
            ],
        }),
    ],
});
```

Templates like `AuthVerify.html`, `AuthRegister.html`, and `AuthForgotPassword.html` are loaded by key:

```typescript
const template = await this._resourceManager.loadAsStringAsync('AuthVerify.html');
```

By listing your own `assets/` first, you can override built-in templates without modifying the library.

### Swagger UI Assets

`platform-openapi` loads its theme files (`swagger.css`, `swagger.js`, `swagger.html`) through the same mechanism:

```typescript
const css = this._resourceManager.loadAsString('swagger.css');
const js = this._resourceManager.loadAsString('swagger.js');
```

### Application Index Page

`platform-core`'s `HostService` loads `index.html` as a template for the root route (the `ResourceManager` itself comes from `platform-resources`):

```typescript
const html = await this._resourceManager.loadAsStringAsync('index.html');
```

---

## Caching

Pass a cache instance from `platform-caching` to avoid repeated file reads or blob downloads:

```typescript
import { LayeredCacheFactory } from '@pixel-brewery/archipel-platform-caching';

ResourceModule.forRoot({
  strategies: [
    new FileResourceStrategy({ basePaths: [...] }),
  ],
  cache: LayeredCacheFactory.create<string, IResourceResult>({
    maxSize: 100,
  }),
  cacheTtl: 1800, // 30 minutes
})
```

- On load: cache is checked first. On hit, the resource is returned immediately.
- On miss: strategies are tried, and the result is cached for future requests.
- Use `invalidate(key)` or `invalidateAsync(key)` to clear a cached resource (e.g. after an upload replaces a template).

---

## Debugging

Enable `debug: true` in the module config to have `ResourceManager` call `whatDoIHave()` at startup. This logs every resource available through every strategy — helpful when a resource isn't found and you need to verify the base paths.

```
[ResourceManager] ResourceManager initialized with 2 strategies: file, embedded
[FileResourceStrategy] Available resources:
  - index.html (text/html, 2.4 KB) → /app/dist/assets/index.html
  - swagger.css (text/css, 1.1 KB) → /app/dist/assets/swagger.css
  ...
[EmbeddedResourceStrategy] Available resources:
  - fallback.html (text/html, 52 B) → embedded
```

---

## Writing a Custom Strategy

Implement `IResourceStrategy` to support a new source (e.g. a database, S3 directly, or a remote API):

```typescript
import { IResourceStrategy, IResourceResult } from '@pixel-brewery/archipel-platform-resources';

export class DatabaseResourceStrategy implements IResourceStrategy {
    public get name(): string {
        return 'database';
    }

    public load(key: string): IResourceResult | undefined {
        // Sync lookup — return undefined if not found
    }

    public async loadAsync(key: string): Promise<IResourceResult | undefined> {
        // Async lookup — return undefined if not found
    }

    public exists(key: string): boolean {
        // ...
    }

    public async existsAsync(key: string): Promise<boolean> {
        // ...
    }

    public whatDoIHave(): void {
        // Log available resources for debugging
    }
}
```

Then add it to the strategies array:

```typescript
ResourceModule.forRoot({
  strategies: [
    new FileResourceStrategy({ basePaths: [...] }),
    new DatabaseResourceStrategy(prisma),
  ],
})
```

---

## Checklist

- [ ] `ResourceModule.forRoot()` registered in the root module
- [ ] Base paths include library asset directories for all used packages
- [ ] App-level overrides listed **before** library paths in `basePaths`
- [ ] Async methods used when `BlobResourceStrategy` is in the chain
- [ ] Cache configured for production (avoids repeated disk/network reads)
- [ ] `debug: true` used during development to verify resource availability
