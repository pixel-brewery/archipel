---
title: 'Class: BlobModule'
generated: true
editUrl: false
---

# Class: BlobModule

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L47)

NestJS module responsible for providing blob storage services.
Uses a strategy pattern to support pluggable storage backends.

## Example

```typescript
import { BlobModule } from '@pixel-brewery/archipel-platform-blob-storage';
import { VercelBlobStorageStrategy, VERCEL_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/vercel';

BlobModule.register({
    storageStrategy: VercelBlobStorageStrategy,
    configEntries: VERCEL_CONFIG_ENTRIES,
});
```

## Constructors

### Constructor

```ts
new BlobModule(): BlobModule;
```

#### Returns

`BlobModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L57)

Configures the module with the specified storage strategy.

#### Parameters

| Parameter | Type                                                 | Description                       |
| --------- | ---------------------------------------------------- | --------------------------------- |
| `options` | [`IBlobModuleOptions`](Interface.IBlobModuleOptions) | The module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition.
