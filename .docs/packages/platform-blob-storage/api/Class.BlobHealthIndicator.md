---
title: 'Class: BlobHealthIndicator'
generated: true
editUrl: false
---

# Class: BlobHealthIndicator

Defined in: [libs/platform-blob-storage/src/health/BlobHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/health/BlobHealthIndicator.ts#L17)

Health indicator for blob storage service.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new BlobHealthIndicator(configService, httpHealthIndicator): BlobHealthIndicator;
```

Defined in: [libs/platform-blob-storage/src/health/BlobHealthIndicator.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/health/BlobHealthIndicator.ts#L32)

Constructs a new instance of the `BlobHealthIndicator` class.

#### Parameters

| Parameter             | Type                  |
| --------------------- | --------------------- |
| `configService`       | `ConfigService`       |
| `httpHealthIndicator` | `HttpHealthIndicator` |

#### Returns

`BlobHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'blob';
```

Defined in: [libs/platform-blob-storage/src/health/BlobHealthIndicator.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/health/BlobHealthIndicator.ts#L41)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<HealthIndicatorResult<"blob">>;
```

Defined in: [libs/platform-blob-storage/src/health/BlobHealthIndicator.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/health/BlobHealthIndicator.ts#L53)

Checks if the blob storage endpoint is reachable.

#### Returns

`Promise`\<`HealthIndicatorResult`\<`"blob"`\>\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
