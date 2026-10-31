---
title: 'Function: maskSensitiveFields()'
generated: true
editUrl: false
---

# Function: maskSensitiveFields()

```ts
function maskSensitiveFields(value): unknown;
```

Defined in: [libs/platform-core/src/utils/MaskSensitiveUtils.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/MaskSensitiveUtils.ts#L35)

Recursively masks values of sensitive keys in a plain object for safe logging.

## Parameters

| Parameter | Type      | Description                                                |
| --------- | --------- | ---------------------------------------------------------- |
| `value`   | `unknown` | Arbitrary value to sanitize (objects, arrays, primitives). |

## Returns

`unknown`

A new value with sensitive fields replaced by `'***'`.
