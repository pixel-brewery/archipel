---
title: 'Function: FeatureFlag()'
generated: true
editUrl: false
---

# Function: FeatureFlag()

```ts
function FeatureFlag(flagKey): CustomDecorator<unknown>;
```

Defined in: [libs/platform-feature-flags/src/decorators/FeatureFlag.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/decorators/FeatureFlag.ts#L17)

Decorator to mark endpoints that require a specific feature flag to be enabled.
The guard reads this metadata to evaluate the flag before allowing access.

## Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `flagKey` | `string` | The unique key of the feature flag to check. |

## Returns

`CustomDecorator`\<`unknown`\>
