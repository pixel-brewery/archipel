---
title: Blob Storage
description: Upload, download, and manage files with multi-provider blob storage using Vercel, Azure, AWS S3, or custom providers.
order: 7
---

# Blob Storage

This guide covers file storage with `platform-blob-storage`: choosing a provider, uploading and downloading files, generating signed URLs, and optionally tracking file metadata with persistence abstract bases.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-blob-storage
```

---

## Choose a Strategy

`platform-blob-storage` abstracts file operations behind a unified `BlobService`. You select the storage strategy at module registration time. Built-in strategies:

| Strategy   | Import subpath      | When to use                                 |
| ---------- | ------------------- | ------------------------------------------- |
| **Vercel** | `strategies/vercel` | Vercel-hosted apps with Vercel Blob storage |
| **Azure**  | `strategies/azure`  | Azure Blob Storage accounts                 |
| **AWS S3** | `strategies/aws-s3` | Amazon S3 or S3-compatible providers        |
| **Local**  | `strategies/local`  | Local filesystem (development / testing)    |
| **Custom** | —                   | Extend `BlobStorageStrategyBase`            |

---

## Module Registration

```typescript
import { Module } from '@nestjs/common';
import { BlobModule } from '@pixel-brewery/archipel-platform-blob-storage';
import { AwsS3BlobStorageStrategy, AWS_S3_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/aws-s3';

@Module({
    imports: [
        BlobModule.register({
            storageStrategy: AwsS3BlobStorageStrategy,
            configEntries: AWS_S3_CONFIG_ENTRIES,
        }),
    ],
})
export class AppModule {}
```

Each provider reads its credentials from environment variables via the `ConfigModule`. Set the variables for your chosen provider:

### AWS S3

```dotenv
BLOB_AWS_REGION=eu-central-1
BLOB_AWS_BUCKET=my-app-uploads
BLOB_AWS_ACCESS_KEY_ID=AKIA...
BLOB_AWS_SECRET_ACCESS_KEY=secret...
```

> **Note:** `accessKeyId` and `secretAccessKey` must be provided **together**. Omit both to use the default AWS credential chain (e.g., IAM roles, instance profiles).

### Azure Blob Storage

You can authenticate with either a **connection string** or **DefaultAzureCredential** (via managed identity):

```dotenv
# Option 1: Connection string
BLOB_AZURE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
BLOB_AZURE_CONTAINER=uploads

# Option 2: DefaultAzureCredential (no connection string needed)
BLOB_AZURE_ACCOUNT_NAME=mystorageaccount
BLOB_AZURE_CONTAINER=uploads
```

When using `accountName` without a `connectionString`, the provider authenticates via `DefaultAzureCredential` from `@azure/identity`. This supports managed identities, environment credentials, and other Azure credential sources without storing secrets.

> **Peer dependency:** Install `@azure/identity` when using DefaultAzureCredential: `yarn add @azure/identity`

### Vercel Blob

```dotenv
BLOB_VERCEL_TOKEN=your-vercel-blob-token
```

---

## Uploading Files

Inject `BlobService` to upload files. It returns metadata about the stored blob.

```typescript
import { Injectable } from '@nestjs/common';
import { BlobService } from '@pixel-brewery/archipel-platform-blob-storage';

@Injectable()
export class AvatarService {
    private readonly _blobService: BlobService;

    constructor(blobService: BlobService) {
        this._blobService = blobService;
    }

    public async uploadAvatar(userId: string, file: Buffer, mimeType: string): Promise<string> {
        const result = await this._blobService.upload({
            key: `avatars/${userId}`,
            body: file,
            contentType: mimeType,
        });

        return result.url;
    }
}
```

### Handling Multipart Uploads in Controllers

For HTTP file uploads, use the `@UploadedFile()` decorator with Multer:

```typescript
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Controller('avatars')
export class AvatarController {
    private readonly _avatarService: AvatarService;

    constructor(avatarService: AvatarService) {
        this._avatarService = avatarService;
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    public async upload(@User() user: IAuthSubject, @UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
        const url = await this._avatarService.uploadAvatar(user.id, file.buffer, file.mimetype);
        return { url };
    }
}
```

---

## Downloading and Signed URLs

```typescript
// Download a blob
const content = await this._blobService.download('avatars/user-123');

// Generate a time-limited signed URL for direct client access
const signedUrl = await this._blobService.getSignedUrl('avatars/user-123', {
    expiresIn: 3600, // seconds
});
```

Signed URLs are useful for serving private files directly to the client without proxying through your server.

---

## Deleting Files

```typescript
await this._blobService.deleteFile('avatars/user-123');
```

---

## Listing Objects

Enumerate a bucket page by page. Use it to reconcile your own records against what is actually stored — the direction that finds objects you never booked.

```typescript
if (!this._blobService.supports('listObjects')) {
    // The configured provider cannot enumerate; skip reconciliation rather than failing.
    return;
}

let continuationToken: string | undefined;

do {
    const page = await this._blobService.listObjects({ prefix: 'invoices/', maxKeys: 500, continuationToken });

    for (const entry of page.entries) {
        // entry.key, entry.size, entry.lastModified
    }

    continuationToken = page.continuationToken;
} while (continuationToken);
```

A listing carries only what every provider reports cheaply: key, size and — where available — last modification and etag. Anything beyond that needs a per-object request and is deliberately not part of a listing.

Providers that cannot enumerate throw `BlobStorageUnsupportedOperationError`. Probe with `supports()` instead of treating the error as control flow.

---

## Inspecting Object History and Deleting Conditionally

Azure implements two additional optional operations. Probe `BlobOptionalOperation.InspectObjectHistory` and `BlobOptionalOperation.DeleteObjectConditionally` before using them. An unsupported strategy throws `BlobStorageUnsupportedOperationError`; it never supplies a fabricated empty history or falls back to an unguarded deletion.

```typescript
import { BlobOptionalOperation } from '@pixel-brewery/archipel-platform-blob-storage';

if (!this._blobService.supports(BlobOptionalOperation.InspectObjectHistory)) {
    throw new Error('The configured provider cannot inspect object history.');
}

const page = await this._blobService.inspectObjectHistory({
    key: 'archive/document.pdf',
    maxKeys: 100,
    timeoutMs: 5000,
});
// Compare providerId, resourceId and bucket with the application's trusted identity.
// Follow page.continuationToken within a bounded application-owned scan,
// even if page.entries is empty.
```

Each entry concerns only the exact canonical key and carries available `versionId`, `snapshotId`, `isCurrentVersion`, `deleted`, `etag`, `deletedAt` and `remainingRetentionDays` facts. One call reads one provider page, with `maxKeys` from 1 to 5,000 and a default of 1,000. Missing optional facts are unknown. A failed listing or unavailable container remains an error, not proof that the object's recoverable history is empty.

The returned `resourceId` is the actual container endpoint without user information, query or fragment. Azure upload metadata returns the same identity and the actual configured `bucket`; it does not claim that an ignored legacy upload bucket was used. Persist upload identity together with its version and ETag when the application needs a durable generation record. A later inspection cannot prove an unrecorded historical upload identity merely because its path matches.

After the application has independently authorized and matched that identity, it can guard one deletion with a single exact strong ETag:

```typescript
await this._blobService.deleteObjectConditionally({
    key: 'archive/document.pdf',
    resourceId: 'https://account.blob.core.windows.net/container',
    versionId: 'previous-version',
    ifMatch: '"known-strong-etag"',
    timeoutMs: 5000,
});
```

Select `versionId` or `snapshotId`, never both. With neither selector, the base object is selected. Empty selectors and empty, wildcard, weak or multi-value ETags are invalid; alternate buckets are rejected by these new Azure operations. A supplied `resourceId` must match the actual target before mutation. A provider precondition failure returns `BlobStoragePreconditionFailedError` (`BLOB_STORAGE_PRECONDITION_FAILED`). It does not silently retry against a newer object. Historical version/snapshot deletion leaves base-object persistence accounting intact. Ordinary Azure `deleteObject` and `objectExists` also honor their existing `versionId` selector.

After successful conditional deletion of the base object, persistence uses only the optional `BlobObjectPersistenceBase.markAsDeletedIfUnchanged(request): Promise<boolean>` hook. Its exported `IBlobConditionalDeletionPersistenceRequest` contains `providerId`, `resourceId`, `bucket`, `key`, `ifMatch` and optional selectors. Implement the comparison and update as one atomic write; return `false` if the stored generation is missing or different. Never release a newer upload merely because it reuses the same key. Without a supplied resource identity or a CAS-capable hook, metadata stays unchanged. A `false` return or hook failure likewise never invokes the legacy key-only `markAsDeleted` fallback. Safe diagnostics distinguish provider success from skipped, unmatched or failed bookkeeping without logging raw adapter errors. A fulfilled provider method is not by itself a metadata-update receipt; applications retain their own reconciliation evidence. Historical selectors never invoke base accounting. The existing ordinary `deleteObject` callback remains unchanged.

Both operations accept an optional `abortSignal`. Their default and maximum whole-request client I/O budget is 30,000 ms, including SDK retries; `timeoutMs` can reduce it to a positive whole-millisecond value. The SDK receives the cancellation signal directly. Aborting client I/O does not undo a remotely accepted mutation, so applications still need durable reconciliation and concurrency guards.

These operations observe the configured container's object history and retain ordinary Azure deletion semantics. They neither perform permanent deletion nor inspect deleted containers, backups, replicas or external restore paths. An empty history, a current-object 404 or successful delete is not an irreversible-erasure guarantee.

---

## Tracking Metadata (Optional Abstract Bases)

By default, `BlobService` performs storage operations without persisting metadata to your database. If you need to track uploaded files (for listing, auditing, or cleanup), implement the optional persistence abstract bases.

A abstract base runs **after** the object is already stored, so a failing abstract base must not fail the operation. `BlobService` catches and logs the failure and reports it through `metadataPersisted` on the upload result. Consumers that keep their own accounting should treat `metadataPersisted === false` as drift to reconcile rather than as a failed upload.

### BlobObjectPersistenceBase

Tracks blob metadata after upload and deletion:

```typescript
import { Injectable } from '@nestjs/common';
import { BlobObjectPersistenceBase } from '@pixel-brewery/archipel-platform-blob-storage';
import { PrismaService } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class PrismaBlobObjectAdapter extends BlobObjectPersistenceBase {
    private readonly _prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this._prisma = prisma;
    }

    public async onUploaded(key: string, url: string, contentType: string, size: number): Promise<void> {
        await this._prisma.blobObject.upsert({
            where: { key },
            create: { key, url, contentType, size },
            update: { url, contentType, size },
        });
    }

    public async onDeleted(key: string): Promise<void> {
        await this._prisma.blobObject.deleteMany({ where: { key } });
    }
}
```

### BlobVariantPersistenceBase

Tracks image variants (thumbnails, resized versions):

```typescript
import { Injectable } from '@nestjs/common';
import { BlobVariantPersistenceBase } from '@pixel-brewery/archipel-platform-blob-storage';
import { PrismaService } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class PrismaBlobVariantAdapter extends BlobVariantPersistenceBase {
    private readonly _prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this._prisma = prisma;
    }

    public async onVariantCreated(originalKey: string, variantKey: string, width: number, height: number): Promise<void> {
        await this._prisma.blobVariant.create({
            data: { originalKey, variantKey, width, height },
        });
    }
}
```

### Register with Persistence

```typescript
import { AwsS3BlobStorageStrategy, AWS_S3_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/aws-s3';

BlobModule.register({
  storageStrategy: AwsS3BlobStorageStrategy,
  configEntries: AWS_S3_CONFIG_ENTRIES,
  objectPersistence: PrismaBlobObjectAdapter,
  variantPersistence: PrismaBlobVariantAdapter,
}),
```

---

## Security

All built-in blob storage strategies (AWS S3, Azure, Vercel, Local) apply automatic key normalization via the internal `normalizeKey` method before any storage operation. This includes:

- **Path traversal prevention** — segments such as `..` and `.` are removed so callers cannot escape the intended directory.
- **Backslash normalization** — backslashes (`\`) are converted to forward slashes before processing.
- **Leading-slash stripping** — a leading `/` is removed to produce clean, relative keys.
- **Control-character rejection** — keys containing characters in the `\x00`–`\x1f` range cause an immediate `Error` to be thrown.

These checks run transparently on every `uploadObject`, `downloadObject`, `deleteObject`, and `getSignedUrl` call. No additional configuration is required.

---

## Health Checks

`platform-blob-storage` registers a health indicator automatically. It verifies connectivity to the configured provider. The result is included in your `/health` endpoint if you use `platform-core`'s health module.

---

## Next Steps

- See the [Implementing Adapters](/guides/implementing-adapters) guide for the general abstract bases and adapters pattern
- Browse the [platform-blob-storage API reference](/packages/platform-blob-storage/api/) for all method signatures
