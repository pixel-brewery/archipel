---
title: 'Type Alias: AgentInterceptionResult'
generated: true
editUrl: false
---

# Type Alias: AgentInterceptionResult

```ts
type AgentInterceptionResult =
    | {
          action: 'continue';
          transition: AgentTransition;
      }
    | {
          action: 'pause';
      }
    | {
          action: 'stop';
          reason?: string;
      };
```

Defined in: [libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts#L8)

Continue with an optionally rewritten transition, pause before execution, or stop.

## Union Members

### Type Literal

```ts
{
    action: 'continue';
    transition: AgentTransition;
}
```

| Name         | Type                                           | Description                                                         | Defined in                                                                                                                                                                                                          |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`     | `"continue"`                                   | Policy decision to continue, pause or stop the selected transition. | [libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts#L13) |
| `transition` | [`AgentTransition`](TypeAlias.AgentTransition) | Typed next step approved or rewritten by the interception policy.   | [libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts#L17) |

---

### Type Literal

```ts
{
    action: 'pause';
}
```

| Name     | Type      | Description                                                         | Defined in                                                                                                                                                                                                          |
| -------- | --------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action` | `"pause"` | Policy decision to continue, pause or stop the selected transition. | [libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts#L23) |

---

### Type Literal

```ts
{
  action: "stop";
  reason?: string;
}
```

| Name      | Type     | Description                                                          | Defined in                                                                                                                                                                                                          |
| --------- | -------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`  | `"stop"` | Policy decision to continue, pause or stop the selected transition.  | [libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts#L29) |
| `reason?` | `string` | Optional application explanation for a stopped or waiting operation. | [libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInterceptionResult.ts#L33) |
