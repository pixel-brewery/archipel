---
title: 'Interface: IRegisteredResource'
generated: true
editUrl: false
---

# Interface: IRegisteredResource

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredResource.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredResource.ts#L6)

Entry for a registered resource handler.

## Properties

### handler

```ts
readonly handler: (...args) => unknown;
```

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredResource.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredResource.ts#L10)

Bound application handler invoked with the requested URI and optional template parameters.

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| ...`args` | `unknown`[] |

#### Returns

`unknown`

---

### metadata

```ts
readonly metadata: IMcpResourceMetadata;
```

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredResource.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredResource.ts#L8)

Resource metadata supplied by the decorator or explicit registration.
