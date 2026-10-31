---
title: 'Type Alias: AgentLoopState'
generated: true
editUrl: false
---

# Type Alias: AgentLoopState

```ts
type AgentLoopState = 'message_received' | 'inference' | 'inference_streaming' | 'function_call' | 'model_message' | 'idle';
```

Defined in: [libs/platform-intelligence-agents/src/contracts/AgentLoopState.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/contracts/AgentLoopState.ts#L6)

Identifies the observable execution phases of an agent loop.
