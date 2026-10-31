---
title: 'Function: env()'
generated: true
editUrl: false
---

# Function: env()

```ts
function env(strings, ...values): string;
```

Defined in: [libs/platform-core/src/utils/EnvUtils.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/utils/EnvUtils.ts#L7)

Marker function for environment strings.

It behaves like a normal template literal but allows you to
later search/grep all `env` usages in the codebase.

## Parameters

| Parameter   | Type                   |
| ----------- | ---------------------- |
| `strings`   | `TemplateStringsArray` |
| ...`values` | `unknown`[]            |

## Returns

`string`
