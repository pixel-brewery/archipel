---
title: '@pixel-brewery/archipel-platform-intelligence-agents'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-intelligence-agents

## Classes

| Class                                                              | Description                                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [Agent](Class.Agent)                                               | Defines an AI participant with its own instructions, tool catalog and conversation memory.       |
| [AgentEvent](Class.AgentEvent)                                     | Represents a semantic event with producer identity and optional loop correlation.                |
| [AgentEventSinkBase](Class.AgentEventSinkBase)                     | Application-owned audit, telemetry or distributed-event adapter. No vendor cloud dependency.     |
| [AgentInferenceBase](Class.AgentInferenceBase)                     | Defines a replaceable boundary for one buffered or streaming model step.                         |
| [AgentInterceptionBase](Class.AgentInterceptionBase)               | Defines the application policy boundary before a selected loop state executes.                   |
| [AgentRuntime](Class.AgentRuntime)                                 | Owns participant membership and coordinates isolated agent runs for one application scope.       |
| [AgentRuntimeError](Class.AgentRuntimeError)                       | Sanitized failure at an agent runtime boundary.                                                  |
| [AgentRuntimeFactory](Class.AgentRuntimeFactory)                   | Creates explicitly owned runtimes and disposes them on application shutdown.                     |
| [AgentsModule](Class.AgentsModule)                                 | Multi-agent orchestration layered above platform-intelligence. No global runtime or credentials. |
| [Human](Class.Human)                                               | Human participant that can send messages and react to semantic events.                           |
| [IntelligenceInferenceAdapter](Class.IntelligenceInferenceAdapter) | Uses Archipel's existing models, validation, provider resilience and streaming.                  |
| [McpToolAdapter](Class.McpToolAdapter)                             | Adapts the shared MCP client's protocol tools to the canonical intelligence tool contract.       |
| [ModelContext](Class.ModelContext)                                 | Maintains a bounded conversation with defensive snapshots and independent forks.                 |
| [ParticipantBase](Class.ParticipantBase)                           | Combines a stable participant identity with replaceable situation handlers.                      |
| [RuntimeState](Class.RuntimeState)                                 | Maintains bounded participant membership for one explicitly owned runtime.                       |
| [SituationProcessorBase](Class.SituationProcessorBase)             | Application-owned reaction; async processors do not block other participants.                    |
| [SituationSpecificationBase](Class.SituationSpecificationBase)     | Defines a composable predicate for selecting participant reactions.                              |

## Interfaces

| Interface                                                      | Description                                                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [IAgentConfiguration](Interface.IAgentConfiguration)           | Provider-neutral virtual participant definition; product identity remains application-owned.    |
| [IAgentInferenceRequest](Interface.IAgentInferenceRequest)     | One provider step. Tools are declarations only; execution belongs to the agent loop.            |
| [IAgentInferenceResult](Interface.IAgentInferenceResult)       | Normalized provider output shared by buffered and streaming loops.                              |
| [IAgentRunOptions](Interface.IAgentRunOptions)                 | Bounded per-run controls. Model/provider policy remains in platform-intelligence.               |
| [IAgentRunResult](Interface.IAgentRunResult)                   | Observable outcome. Paused loops are process-local and must be resumed or cancelled explicitly. |
| [IAgentRuntimeDiagnostics](Interface.IAgentRuntimeDiagnostics) | Bounded local runtime gauges for consumer observability.                                        |
| [IAgentRuntimeOptions](Interface.IAgentRuntimeOptions)         | Explicit ownership and resource budgets for a runtime.                                          |
| [IAgentsModuleOptions](Interface.IAgentsModuleOptions)         | Consumer modules can provide an inference adapter; the default composes platform-intelligence.  |
| [IHumanConfiguration](Interface.IHumanConfiguration)           | Human participant definition.                                                                   |
| [IModelContextRecord](Interface.IModelContextRecord)           | Application-persistable memory record; does not contain executable tools.                       |
| [IParticipantManifest](Interface.IParticipantManifest)         | Stable identity visible within one explicitly owned runtime.                                    |
| [ISituationContext](Interface.ISituationContext)               | One event and the participant receiving it.                                                     |
| [ISituationHandler](Interface.ISituationHandler)               | A predicate and its reaction.                                                                   |

## Type Aliases

| Type Alias                                                   | Description                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [AgentInferenceEvent](TypeAlias.AgentInferenceEvent)         | Stream events end in exactly one normalized output.                                              |
| [AgentInterceptionResult](TypeAlias.AgentInterceptionResult) | Continue with an optionally rewritten transition, pause before execution, or stop.               |
| [AgentLoopState](TypeAlias.AgentLoopState)                   | Identifies the observable execution phases of an agent loop.                                     |
| [AgentTransition](TypeAlias.AgentTransition)                 | Interceptable next step. Discriminated inputs prevent a state receiving another state's payload. |
