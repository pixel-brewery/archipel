---
title: 'Interface: IRegisteredPrompt'
generated: true
editUrl: false
---

# Interface: IRegisteredPrompt

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredPrompt.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredPrompt.ts#L6)

Entry for a registered prompt handler.

## Properties

### handler

```ts
readonly handler: (...args) => unknown;
```

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredPrompt.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredPrompt.ts#L10)

Bound application handler invoked with the protocol's prompt arguments.

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| ...`args` | `unknown`[] |

#### Returns

`unknown`

---

### metadata

```ts
readonly metadata: IMcpPromptMetadata;
```

Defined in: [libs/platform-mcp/src/interfaces/IRegisteredPrompt.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IRegisteredPrompt.ts#L8)

Prompt metadata supplied by the decorator or explicit registration.
