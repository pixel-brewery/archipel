---
title: 'Class: AgentRuntimeError'
generated: true
editUrl: false
---

# Class: AgentRuntimeError

Defined in: [libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts#L6)

Sanitized failure at an agent runtime boundary.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new AgentRuntimeError(
   code,
   message,
   loopId?
): AgentRuntimeError;
```

Defined in: [libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts#L26)

Creates a library-owned failure without exposing provider diagnostics or credentials.

#### Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `code`    | `string` | Stable machine-readable failure category.                      |
| `message` | `string` | Sanitized explanation suitable for application error handling. |
| `loopId?` | `string` | Correlation identifier of the affected loop, when available.   |

#### Returns

`AgentRuntimeError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts#L11)

Stable machine-readable failure category owned by the agent runtime package.

---

### loopId?

```ts
readonly loopId?: string;
```

Defined in: [libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/errors/AgentRuntimeError.ts#L15)

Correlation identifier of the originating agent loop, when applicable.
