---
title: 'Interface: IRegisteredTool'
generated: true
editUrl: false
---

# Interface: IRegisteredTool

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredTool.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredTool.ts#L6)

Entry for a registered tool handler.

## Properties

### handler

```ts
readonly handler: (...args) => unknown;
```

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredTool.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredTool.ts#L10)

Bound application handler invoked with parsed protocol arguments.

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| ...`args` | `unknown`[] |

#### Returns

`unknown`

---

### metadata

```ts
readonly metadata: IMcpToolMetadata;
```

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredTool.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredTool.ts#L8)

Tool metadata supplied by the decorator or explicit registration.
