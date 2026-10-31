---
title: '@pixel-brewery/archipel-platform-blob-storage'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-blob-storage

## Classes

| Class                                                                              | Description                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AwsS3BlobStorageStrategy](Class.AwsS3BlobStorageStrategy)                         | Provides a blob storage strategy backed by Amazon S3.                                                                                                                                                                         |
| [AzureBlobStorageStrategy](Class.AzureBlobStorageStrategy)                         | Provides a blob storage strategy backed by Microsoft Azure Blob Storage.                                                                                                                                                      |
| [BlobHealthIndicator](Class.BlobHealthIndicator)                                   | Health indicator for blob storage service.                                                                                                                                                                                    |
| [BlobModule](Class.BlobModule)                                                     | NestJS module responsible for providing blob storage services. Uses a strategy pattern to support pluggable storage backends.                                                                                                 |
| [BlobObjectNotFoundError](Class.BlobObjectNotFoundError)                           | Indicates that the requested blob object does not exist.                                                                                                                                                                      |
| [BlobObjectPersistenceBase](Class.BlobObjectPersistenceBase)                       | Abstract base for persisting blob object metadata. Consuming projects must provide a concrete implementation (e.g. backed by Prisma, Mongo, etc.) and register it via `BlobModule.forRoot({ objectPersistence: MyAdapter })`. |
| [BlobService](Class.BlobService)                                                   | Provides a generic abstraction for blob storage operations independent of the underlying provider.                                                                                                                            |
| [BlobStorageDisabledError](Class.BlobStorageDisabledError)                         | Indicates that a blob operation was attempted while storage is disabled.                                                                                                                                                      |
| [BlobStorageError](Class.BlobStorageError)                                         | Describes a provider-independent blob storage operation failure.                                                                                                                                                              |
| [BlobStorageStrategyBase](Class.BlobStorageStrategyBase)                           | Abstract base class for blob storage strategies. Every concrete provider (AWS S3, Azure, Vercel, Local, etc.) must extend this class. Serves as both the type contract and the NestJS DI token type reference.                |
| [BlobStorageUnavailableError](Class.BlobStorageUnavailableError)                   | Indicates a transient provider or network availability failure.                                                                                                                                                               |
| [BlobStorageUnsupportedOperationError](Class.BlobStorageUnsupportedOperationError) | Indicates that the selected provider does not implement an operation.                                                                                                                                                         |
| [BlobVariantPersistenceBase](Class.BlobVariantPersistenceBase)                     | Abstract base for persisting blob variant metadata. Consuming projects must provide a concrete implementation and register it via `BlobModule.forRoot({ variantPersistence: MyAdapter })`.                                    |
| [EmptyBlobStorageStrategy](Class.EmptyBlobStorageStrategy)                         | Provides a blob storage strategy backed by the local filesystem.                                                                                                                                                              |
| [LocalBlobStorageStrategy](Class.LocalBlobStorageStrategy)                         | Provides a blob storage strategy backed by the local filesystem.                                                                                                                                                              |
| [VercelBlobStorageStrategy](Class.VercelBlobStorageStrategy)                       | Provides a blob storage strategy backed by the Vercel Blob API.                                                                                                                                                               |

## Interfaces

| Interface                                                | Description                             |
| -------------------------------------------------------- | --------------------------------------- |
| [IBlobDeleteRequest](Interface.IBlobDeleteRequest)       | -                                       |
| [IBlobDownloadRequest](Interface.IBlobDownloadRequest)   | -                                       |
| [IBlobDownloadResult](Interface.IBlobDownloadResult)     | -                                       |
| [IBlobExistsRequest](Interface.IBlobExistsRequest)       | -                                       |
| [IBlobListEntry](Interface.IBlobListEntry)               | One object of a bucket listing.         |
| [IBlobListRequest](Interface.IBlobListRequest)           | Describes one page of a bucket listing. |
| [IBlobListResult](Interface.IBlobListResult)             | One page of a bucket listing.           |
| [IBlobModuleOptions](Interface.IBlobModuleOptions)       | -                                       |
| [IBlobObjectMetadata](Interface.IBlobObjectMetadata)     | -                                       |
| [IBlobSignedUrlRequest](Interface.IBlobSignedUrlRequest) | -                                       |
| [IBlobUploadRequest](Interface.IBlobUploadRequest)       | -                                       |
| [IBlobUploadResult](Interface.IBlobUploadResult)         | -                                       |

## Type Aliases

| Type Alias                                                     | Description                                          |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| [BlobDownloadResponseType](TypeAlias.BlobDownloadResponseType) | -                                                    |
| [BlobOptionalOperation](TypeAlias.BlobOptionalOperation)       | An operation that a provider may or may not support. |
| [BlobUploadBody](TypeAlias.BlobUploadBody)                     | -                                                    |

## Variables

| Variable                                                                                  | Description                                                                                          |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [AWS\_S3\_ACCESS\_KEY\_ID](Variable.AWS_S3_ACCESS_KEY_ID)                                 | AWS S3 access key ID.                                                                                |
| [AWS\_S3\_BUCKET](Variable.AWS_S3_BUCKET)                                                 | AWS S3 bucket name.                                                                                  |
| [AWS\_S3\_CONFIG\_ENTRIES](Variable.AWS_S3_CONFIG_ENTRIES)                                | Configuration entries required by the AWS S3 blob storage strategy.                                  |
| [AWS\_S3\_ENDPOINT](Variable.AWS_S3_ENDPOINT)                                             | AWS S3 custom endpoint (for S3-compatible providers).                                                |
| [AWS\_S3\_REGION](Variable.AWS_S3_REGION)                                                 | AWS S3 region.                                                                                       |
| [AWS\_S3\_SECRET\_ACCESS\_KEY](Variable.AWS_S3_SECRET_ACCESS_KEY)                         | AWS S3 secret access key.                                                                            |
| [AZURE\_BLOB\_CONNECTION\_STRING](Variable.AZURE_BLOB_CONNECTION_STRING)                  | Azure Blob Storage connection string.                                                                |
| [AZURE\_BLOB\_CONTAINER\_NAME](Variable.AZURE_BLOB_CONTAINER_NAME)                        | Azure Blob Storage container name.                                                                   |
| [AZURE\_CONFIG\_ENTRIES](Variable.AZURE_CONFIG_ENTRIES)                                   | Configuration entries required by the Azure blob storage strategy.                                   |
| [BLOB\_STORAGE\_STRATEGY\_TOKEN](Variable.BLOB_STORAGE_STRATEGY_TOKEN)                    | -                                                                                                    |
| [BlobDownloadResponseTypes](Variable.BlobDownloadResponseTypes)                           | -                                                                                                    |
| [BlobOptionalOperation](Variable.BlobOptionalOperation)                                   | Storage operations that not every provider can perform.                                              |
| [LOCAL\_BLOB\_BASE\_PATH](Variable.LOCAL_BLOB_BASE_PATH)                                  | Local blob storage base path.                                                                        |
| [LOCAL\_BLOB\_BUCKET](Variable.LOCAL_BLOB_BUCKET)                                         | Local blob storage bucket (subdirectory).                                                            |
| [LOCAL\_CONFIG\_ENTRIES](Variable.LOCAL_CONFIG_ENTRIES)                                   | Configuration entries required by the local blob storage strategy.                                   |
| [PLATFORM\_BLOB\_STORAGE\_CONFIG\_ENTRIES](Variable.PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES) | All configuration entries for `platform-blob-storage`. All keys are optional at the aggregate level. |
| [VERCEL\_BLOB\_BUCKET](Variable.VERCEL_BLOB_BUCKET)                                       | Vercel Blob bucket name.                                                                             |
| [VERCEL\_BLOB\_PUBLIC\_URL](Variable.VERCEL_BLOB_PUBLIC_URL)                              | Vercel Blob public URL.                                                                              |
| [VERCEL\_BLOB\_READ\_WRITE\_TOKEN](Variable.VERCEL_BLOB_READ_WRITE_TOKEN)                 | Vercel Blob read/write access token.                                                                 |
| [VERCEL\_BLOB\_REGION](Variable.VERCEL_BLOB_REGION)                                       | Vercel Blob region.                                                                                  |
| [VERCEL\_BLOB\_URL](Variable.VERCEL_BLOB_URL)                                             | Vercel Blob API URL.                                                                                 |
| [VERCEL\_CONFIG\_ENTRIES](Variable.VERCEL_CONFIG_ENTRIES)                                 | Configuration entries required by the Vercel blob storage strategy.                                  |
