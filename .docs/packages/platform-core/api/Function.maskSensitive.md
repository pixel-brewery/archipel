---
title: 'Function: maskSensitive()'
generated: true
editUrl: false
---

# Function: maskSensitive()

```ts
function maskSensitive(value): string;
```

Defined in: [libs/platform-core/src/utils/MaskSensitiveUtils.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/MaskSensitiveUtils.ts#L67)

Serializes a value to a JSON string with sensitive keys masked.

## Parameters

| Parameter | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| `value`   | `unknown` | Arbitrary value to sanitize and serialize. |

## Returns

`string`

A JSON string safe for logging.
