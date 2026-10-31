---
title: 'Function: getMimeTypeByFileNameOrExtension()'
generated: true
editUrl: false
---

# Function: getMimeTypeByFileNameOrExtension()

```ts
function getMimeTypeByFileNameOrExtension(...args): string | false;
```

Defined in: [libs/platform-core/src/mime/mimeTypes.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/mime/mimeTypes.ts#L14)

Get MIME type by file name or extension.

## Parameters

| Parameter | Type                          | Description                     |
| --------- | ----------------------------- | ------------------------------- |
| ...`args` | \[`filenameOrExt`: `string`\] | Arguments for mime-types lookup |

## Returns

`string` \| `false`

MIME type or false if not found
