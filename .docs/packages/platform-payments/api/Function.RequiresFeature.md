---
title: 'Function: RequiresFeature()'
generated: true
editUrl: false
---

# Function: RequiresFeature()

```ts
function RequiresFeature(featureKey): CustomDecorator<string>;
```

Defined in: [libs/platform-payments/src/guards/FeatureGuard.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/guards/FeatureGuard.ts#L19)

Decorator to mark endpoints that require feature access check.
The `featureKey` is a free-form string defined by the consuming project.

## Parameters

| Parameter    | Type     |
| ------------ | -------- |
| `featureKey` | `string` |

## Returns

`CustomDecorator`\<`string`\>
