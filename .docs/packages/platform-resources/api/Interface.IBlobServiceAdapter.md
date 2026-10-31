---
title: 'Interface: IBlobServiceAdapter'
generated: true
editUrl: false
---

# Interface: IBlobServiceAdapter

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L14)

Minimal blob service interface to avoid circular dependencies.

## Methods

### downloadFile()

```ts
downloadFile(key): Promise<{
  contentType?: string;
  data: unknown;
}>;
```

Defined in: [libs/platform-resources/src/strategies/BlobResourceStrategy.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/BlobResourceStrategy.ts#L21)

Downloads a file from blob storage.

#### Parameters

| Parameter | Type     | Description  |
| --------- | -------- | ------------ |
| `key`     | `string` | The blob key |

#### Returns

`Promise`\<\{
`contentType?`: `string`;
`data`: `unknown`;
\}\>

The download result
