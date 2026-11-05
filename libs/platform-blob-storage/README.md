# @pixel-brewery/archipel-platform-blob-storage

Blob storage abstraction for file uploads and asset management.

## Features

- **Multi-provider** — Vercel Blob, Azure Blob Storage, AWS S3, local filesystem, and an empty/mock provider out of the box
- **Strategy pattern** — Extend `BlobStorageStrategyBase` to create your own custom storage backend
- **Azure DefaultAzureCredential** — Authenticate via `accountName` using managed identity instead of connection strings
- **AWS S3 credential pairing** — Validates `accessKeyId` and `secretAccessKey` together, or omit both to use the default AWS credential chain
- **AWS S3 resilient downloads** — Graceful handling of JSON parse errors during `downloadObject` (returns raw body on parse failure)
- **Path traversal prevention** — Automatic key normalization strips `..`, `\`, leading slashes, and rejects control characters
- **Signed URLs** — Time-limited pre-signed URLs for direct client access
- **Object listing** — Paged enumeration by prefix across Vercel, Azure, AWS S3 and the local filesystem, for reconciling your own bookkeeping against actual storage
- **Capability probing** — `supports(BlobOptionalOperation.InspectObjectHistory)` and the other optional operation keys tell you what the configured provider can do before you attempt it
- **Explicit execution limits** — Existing upload, download and listing requests optionally require provider-enforced deadlines and caller cancellation. Azure supports them; downloads also abort at a requested byte limit. Unsupported strategies fail before I/O instead of ignoring limits.
- **Azure object history** — Exact-key, paginated inspection of current objects, versions, snapshots and soft-deleted entries, including available deletion and remaining-retention facts
- **Azure conditional deletion** — A single strong ETag guards the base object or one selected version/snapshot; changed targets fail with `BlobStoragePreconditionFailedError`
- **Metadata tracking** — Optional persistence abstract bases for upload auditing and image variant tracking; a failing abstract base never fails the storage operation and is reported through `metadataPersisted`
- **Health checks** — `BlobHealthIndicator` for readiness probes (separate `/health` subpath)

## Guaranteed execution options

`uploadObject`, `uploadVariant`, `downloadObject` and `listObjects` retain their existing behavior when no limits are supplied. To require a bound, pass `execution: { timeoutMs, abortSignal }`. The timeout is an integer from 1 to 30,000 and defaults to 30,000 when `execution` is present. Probe `supportsExecutionOptions('uploadObject' | 'downloadObject' | 'listObjects')`. `BlobService` rejects limits that the selected strategy does not support. Direct calls to the S3, Vercel and local strategies also throw `BlobStorageUnsupportedOperationError` before accessing storage. Upload variants use the upload capability.

Azure combines the caller signal and deadline and supplies the resulting signal to the existing SDK operation, all SDK retries, the listing pager and download-body consumption. A download can additionally specify `maxBytes`, a nonnegative safe integer. This alone also requires execution support and applies the default deadline. The response stream is destroyed if the declared length or actual accumulated bytes exceeds the limit (`BLOB_STORAGE_RESPONSE_TOO_LARGE`), or when cancelled. Requested limits reject a target outside the configured bucket. Calls without limits preserve their compatibility behavior.

```typescript
if (!blobs.supportsExecutionOptions('downloadObject')) {
    throw new Error('The selected provider cannot enforce the required read limits.');
}
const result = await blobs.downloadObject<string>({
    key: 'records/example.json',
    responseType: 'text',
    maxBytes: 256 * 1024,
    execution: { timeoutMs: 5000, abortSignal: cancellation.signal },
});
```

The budget bounds provider I/O, including response consumption; it does not undo a remotely accepted upload or replace a persistence adapter's database limits. A cancelled mutation may have an unknown provider outcome. Callers still own durable intent, idempotency and recovery. These options do not supply create-only writes, immutable retention, independent journaling or restore guarantees. Those policies belong to the consuming application and its actual storage configuration.

## ⚠️ Environment Variables

### Vercel Blob

| Variable                       | Required                      | Default                                 | Description                                        |
| ------------------------------ | ----------------------------- | --------------------------------------- | -------------------------------------------------- |
| `VERCEL_BLOB_URL`              | no                            | `https://blob.vercel-storage.com`       | Base API URL for Vercel Blob                       |
| `VERCEL_BLOB_READ_WRITE_TOKEN` | yes (if not provided in code) | -                                       | Access token used for upload/download/delete       |
| `VERCEL_BLOB_BUCKET`           | no                            | `''`                                    | Default bucket name                                |
| `VERCEL_BLOB_REGION`           | no                            | `''`                                    | Region metadata for uploaded objects               |
| `VERCEL_BLOB_PUBLIC_URL`       | no                            | empty (falls back to `VERCEL_BLOB_URL`) | Public URL base used for signed/public object URLs |

### Azure Blob Storage

| Variable                       | Required | Default | Description                             |
| ------------------------------ | -------- | ------- | --------------------------------------- |
| `AZURE_BLOB_CONNECTION_STRING` | no       | -       | Connection string (alternative to name) |
| `AZURE_BLOB_ACCOUNT_NAME`      | no       | -       | Account name for managed identity auth  |
| `AZURE_BLOB_CONTAINER_NAME`    | yes      | -       | Default container name                  |

### AWS S3

| Variable               | Required | Default     | Description                         |
| ---------------------- | -------- | ----------- | ----------------------------------- |
| `AWS_S3_ACCESS_KEY_ID` | no       | -           | AWS access key (paired with secret) |
| `AWS_S3_SECRET_KEY`    | no       | -           | AWS secret key                      |
| `AWS_S3_REGION`        | no       | `us-east-1` | AWS region                          |
| `AWS_S3_BUCKET`        | yes      | -           | S3 bucket name                      |

## Quick Start

```typescript
import { BlobModule } from '@pixel-brewery/archipel-platform-blob-storage';
import { VercelBlobStorageStrategy, VERCEL_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/vercel';

BlobModule.register({
    storageStrategy: VercelBlobStorageStrategy,
    configEntries: VERCEL_CONFIG_ENTRIES,
});
```

## Import Options

```typescript
// Main import (module, service, abstract bases, abstract base)
import { BlobModule, BlobService, BlobStorageStrategyBase } from '@pixel-brewery/archipel-platform-blob-storage';
import type { IBlobUploadRequest } from '@pixel-brewery/archipel-platform-blob-storage';

// Strategy-specific (tree-shakable sub-exports)
import { VercelBlobStorageStrategy, VERCEL_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/vercel';
import { AzureBlobStorageStrategy, AZURE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/azure';
import { AwsS3BlobStorageStrategy, AWS_S3_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/aws-s3';
import { LocalBlobStorageStrategy, LOCAL_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/local';
import { EmptyBlobStorageStrategy } from '@pixel-brewery/archipel-platform-blob-storage/strategies/empty';

// Health indicator (optional)
import { BlobHealthIndicator } from '@pixel-brewery/archipel-platform-blob-storage/health';
```

## Abstract Bases

| Abstract Base                | Required | Description                        |
| ---------------------------- | -------- | ---------------------------------- |
| `BlobObjectPersistenceBase`  | No       | Upload audit persistence           |
| `BlobVariantPersistenceBase` | No       | Image variant tracking persistence |

## Resource Limits

| Limit                                    | Value           | Description                                                                                                               |
| ---------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Vercel Blob request timeout              | 30 seconds      | `VercelBlobStorageStrategy` aborts requests after 30s                                                                     |
| Health check ping timeout                | 2 seconds       | `BlobHealthIndicator` health check response deadline                                                                      |
| Azure history/conditional-delete request | 30 seconds      | Default and maximum total client I/O budget across SDK retries; `timeoutMs` can select a shorter whole-millisecond budget |
| Azure object-history page                | 1–5,000 entries | `maxKeys` defaults to 1,000; one call reads one provider page and retains its continuation token                          |

## Object History and Conditional Deletion

`inspectObjectHistory` and `deleteObjectConditionally` are optional capabilities, currently implemented by Azure. Other strategies need no new required methods and return `false` from the corresponding `supports()` probe. Calling an unavailable operation throws the existing `BlobStorageUnsupportedOperationError`.

Azure history reads require `@azure/storage-blob` 12.8.0 or later and an exact canonical key. They inspect the configured container and return its actual `providerId`, `resourceId` and `bucket`. For uploads to the configured container, Azure also supplies the container endpoint as `resourceId` with user information, query and fragment removed. An unrestricted legacy upload with an alternate bucket retains that metadata bucket and leaves `resourceId` unset. An absent historical identity must not be reconstructed as proven by inspecting a later object at the same path.

Follow every continuation token within an application-owned total budget, even when the current exact-key page is empty. Failed reads, missing containers and unsupported capabilities throw rather than becoming successful empty observations. History does not inspect deleted containers, backups, replicas or other recovery systems; neither an empty history nor successful deletion proves irreversible erasure.

Conditional deletion requires exactly one quoted strong `ifMatch` ETag. Empty, wildcard, weak and multi-value conditions are rejected. Choose `versionId` or `snapshotId`, never both; omitting both selects the base object. A provider `412` becomes `BlobStoragePreconditionFailedError` with code `BLOB_STORAGE_PRECONDITION_FAILED`, without releasing persistence metadata. Deleting a historical version or snapshot does not release base-object accounting. Ordinary `deleteObject` and `objectExists` also honor Azure `versionId`.

A conditional base-object deletion never deletes unselected snapshots or versions. If associated snapshots prevent Azure from deleting the base object, the provider returns `409`; no include-all-snapshots option or broader retry is applied. Callers must inspect and explicitly delete each intended snapshot with its own `snapshotId` and observed strong ETag, then retry the base deletion only while its resource identity and ETag still match.

Supply the trusted `resourceId` to also guard the actual provider resource before deletion. After a successful base deletion, metadata may change only through the optional `BlobObjectPersistenceBase.markAsDeletedIfUnchanged` hook. Its `IBlobConditionalDeletionPersistenceRequest` carries provider, resource, bucket, key, exact ETag and selectors; adapters must compare these atomically. Missing scope or hook, a `false` comparison result, and hook errors never fall back to `markAsDeleted`. A newer upload at the same key remains untouched. Safe diagnostics distinguish provider success from skipped, unmatched or failed metadata updates without exposing adapter errors. The provider method's successful return alone is not proof of a metadata change. Legacy `deleteObject` retains its existing callback contract.

Both new requests accept `abortSignal` and `timeoutMs` from 1 to 30,000. The signal reaches SDK listing and deletion, including SDK retries. Client cancellation cannot undo a mutation already accepted remotely; callers still need durable identity, concurrency and reconciliation rules. Alternate buckets are rejected by these new Azure operations. No permanent-delete, container-restore or backup-retention guarantee is supplied.

## Operation diagnostics

Provider operation logs expose only fixed operation, provider and outcome facts. Azure, local and S3 upload/delete diagnostics omit object keys, container/bucket names and filesystem paths. The disabled strategy likewise omits request metadata and prefixes. Persistence failures preserve the successful provider result and `metadataPersisted: false` where applicable, while logging a fixed failure result without raw adapter errors, payloads, variant labels or original object identities. Conditional-delete diagnostics retain their separate safe provider-deletion and metadata-update outcomes.

## Peer Dependencies

| Package                                          | Required | Notes                               |
| ------------------------------------------------ | -------- | ----------------------------------- |
| `@pixel-brewery/archipel-platform-configuration` | Yes      | Typed config key support            |
| `@nestjs/common`                                 | Yes      | NestJS core                         |
| `@vercel/blob`                                   | No       | Required for Vercel provider        |
| `@azure/storage-blob`                            | No       | Required for Azure provider         |
| `@azure/identity`                                | No       | Required for Azure managed identity |
| `@aws-sdk/client-s3`                             | No       | Required for AWS S3 provider        |
| `@aws-sdk/s3-request-presigner`                  | No       | Required for S3 signed URLs         |
| `@pixel-brewery/archipel-platform-health`        | No       | Required for health indicator       |
| `@nestjs/terminus`                               | No       | Required for health indicator       |

## Documentation

📖 **Blob Storage Guide:** [`.docs/guides/blob-storage.md`](../../.docs/guides/blob-storage.md)

## Development

```bash
# Build
yarn nx build platform-blob-storage

# Test
yarn nx test platform-blob-storage

# Lint
yarn nx lint platform-blob-storage
```
