---
title: 'Type Alias: AgentTransition'
generated: true
editUrl: false
---

# Type Alias: AgentTransition

```ts
type AgentTransition =
    | {
          input: {
              content: string;
          };
          nextStateId: 'message_received';
      }
    | {
          input: IAgentInferenceRequest;
          nextStateId: 'inference' | 'inference_streaming';
      }
    | {
          input: {
              calls: ReadonlyArray<IIntelligenceToolCall>;
              index: number;
              result: IAgentInferenceResult;
          };
          nextStateId: 'function_call';
      }
    | {
          input: IAgentInferenceResult;
          nextStateId: 'model_message';
      }
    | {
          input: undefined;
          nextStateId: 'idle';
      };
```

Defined in: [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L10)

Interceptable next step. Discriminated inputs prevent a state receiving another state's payload.

## Union Members

### Type Literal

```ts
{
    input: {
        content: string;
    }
    nextStateId: 'message_received';
}
```

| Name            | Type                       | Description                                             | Defined in                                                                                                                                                                                          |
| --------------- | -------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`         | \{ `content`: `string`; \} | Input belonging to the selected state or tool contract. | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L19) |
| `input.content` | `string`                   | User message to append before the first inference step. | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L23) |
| `nextStateId`   | `"message_received"`       | Loop phase selected for the next state execution.       | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L15) |

---

### Type Literal

```ts
{
    input: IAgentInferenceRequest;
    nextStateId: 'inference' | 'inference_streaming';
}
```

| Name          | Type                                                         | Description                                             | Defined in                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`       | [`IAgentInferenceRequest`](Interface.IAgentInferenceRequest) | Input belonging to the selected state or tool contract. | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L34) |
| `nextStateId` | `"inference"` \| `"inference_streaming"`                     | Loop phase selected for the next state execution.       | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L30) |

---

### Type Literal

```ts
{
    input: {
        calls: ReadonlyArray<IIntelligenceToolCall>;
        index: number;
        result: IAgentInferenceResult;
    }
    nextStateId: 'function_call';
}
```

| Name           | Type                                                                                                                                                | Description                                                      | Defined in                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`        | \{ `calls`: `ReadonlyArray`\<`IIntelligenceToolCall`\>; `index`: `number`; `result`: [`IAgentInferenceResult`](Interface.IAgentInferenceResult); \} | Input belonging to the selected state or tool contract.          | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L44) |
| `input.calls`  | `ReadonlyArray`\<`IIntelligenceToolCall`\>                                                                                                          | Ordered tool calls selected by the current provider response.    | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L48) |
| `input.index`  | `number`                                                                                                                                            | Zero-based position of the next tool call in its response batch. | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L52) |
| `input.result` | [`IAgentInferenceResult`](Interface.IAgentInferenceResult)                                                                                          | Provider response that selected this batch of tool calls.        | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L56) |
| `nextStateId`  | `"function_call"`                                                                                                                                   | Loop phase selected for the next state execution.                | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L40) |

---

### Type Literal

```ts
{
    input: IAgentInferenceResult;
    nextStateId: 'model_message';
}
```

| Name          | Type                                                       | Description                                             | Defined in                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`       | [`IAgentInferenceResult`](Interface.IAgentInferenceResult) | Input belonging to the selected state or tool contract. | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L67) |
| `nextStateId` | `"model_message"`                                          | Loop phase selected for the next state execution.       | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L63) |

---

### Type Literal

```ts
{
    input: undefined;
    nextStateId: 'idle';
}
```

| Name          | Type        | Description                                             | Defined in                                                                                                                                                                                          |
| ------------- | ----------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`       | `undefined` | Input belonging to the selected state or tool contract. | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L77) |
| `nextStateId` | `"idle"`    | Loop phase selected for the next state execution.       | [libs/platform-intelligence-agents/src/contracts/AgentTransition.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentTransition.ts#L73) |
