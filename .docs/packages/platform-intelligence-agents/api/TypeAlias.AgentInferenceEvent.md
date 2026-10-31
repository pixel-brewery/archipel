---
title: 'Type Alias: AgentInferenceEvent'
generated: true
editUrl: false
---

# Type Alias: AgentInferenceEvent

```ts
type AgentInferenceEvent =
    | IntelligenceLanguageStreamPart
    | {
          output: unknown;
          type: 'partial-output';
      }
    | {
          result: IAgentInferenceResult;
          type: 'output';
      };
```

Defined in: [libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts#L9)

Stream events end in exactly one normalized output.

## Union Members

`IntelligenceLanguageStreamPart`

---

### Type Literal

```ts
{
    output: unknown;
    type: 'partial-output';
}
```

| Name     | Type               | Description                                                                   | Defined in                                                                                                                                                                                                  |
| -------- | ------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `output` | `unknown`          | Partial structured value that may still change before the final output event. | [libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts#L19) |
| `type`   | `"partial-output"` | Discriminator that identifies the event or stream item contract.              | [libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts#L15) |

---

### Type Literal

```ts
{
    result: IAgentInferenceResult;
    type: 'output';
}
```

| Name     | Type                                                       | Description                                                       | Defined in                                                                                                                                                                                                  |
| -------- | ---------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `result` | [`IAgentInferenceResult`](Interface.IAgentInferenceResult) | Complete provider response emitted once after incremental events. | [libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts#L29) |
| `type`   | `"output"`                                                 | Discriminator that identifies the event or stream item contract.  | [libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentInferenceEvent.ts#L25) |
