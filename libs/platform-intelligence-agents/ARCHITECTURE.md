# Agent Runtime Architecture

The package is a generic orchestration layer above `platform-intelligence`. It owns participant coordination, semantic event dispatch, isolated conversations and bounded loop execution. Consuming applications own authorization, persistence, scheduling, business records and external transport endpoints.

## Responsibilities

| Component                      | Responsibility                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `AgentsModule`                 | Register the inference abstract base and lifecycle-managed factory through NestJS                        |
| `AgentRuntimeFactory`          | Create explicitly owned runtimes and dispose them during shutdown                                        |
| `AgentRuntime`                 | Coordinate membership, active/paused loops and application-facing operations                             |
| `AgentEventDispatcher`         | Dispatch independent participant reactions and sink publications within a bounded queue                  |
| `AgentLoop`                    | Enforce cancellation, interception, transition budgets and terminal outcomes                             |
| `AgentLoopContext`             | Own one run's forked memory, policies, result and tool-call identities                                   |
| `LoopStateExecutor`            | Select the State object for each executable transition                                                   |
| State classes                  | Prepare a message, perform buffered/streaming inference, execute a tool call or publish the final answer |
| `InferenceResultRouter`        | Apply identical result validation and routing to buffered and streaming inference                        |
| `AgentToolExecutor`            | Validate tool data and apply approval/permission guards before effects                                   |
| `IntelligenceInferenceAdapter` | Delegate provider behavior to the canonical intelligence infrastructure                                  |
| `ModelContext`                 | Maintain bounded, defensive conversation snapshots and persistence records                               |
| MCP tool adapter subpath       | Translate the shared MCP client protocol into intelligence tool definitions                              |

## Dependency boundaries

The runtime depends on the abstract `AgentInferenceBase`. The default adapter depends on `IntelligenceLanguageGenerator`, which retains ownership of model/provider selection, request validation, retries, deadlines and usage normalization. The orchestration package does not add a second provider catalog or SDK engine.

State behavior uses the State pattern. The shared inference template ensures buffered and streaming responses follow the same result-routing rules. Event dispatch uses Observer semantics without awaiting one participant before notifying another. These responsibilities remain separate so lifecycle changes do not require editing provider or tool code.

Each runtime and loop is an explicitly owned object. Injectable factories retain bounded lifecycle registries; they do not store a current user or tenant. Each run forks conversation memory and commits only its appended conversation after successful completion. Membership and tracked-work collections use copy-on-write updates.

## Effect boundary

Inference receives tool declarations without executors and performs one provider step. Every returned tool call crosses the runtime's approval, schema-validation and authoritative application guard before its effect. Calls execute in response order and retain their identifiers. Reused call identifiers fail before a repeated effect. The runtime does not retry tool effects.

A structured result requested after tool use is produced by a final tool-free formatting call. Provider guards and per-call usage evidence also apply to that call. Event sinks are asynchronous observers, not transactional durable audit outboxes.

## Persistence and recovery

Applications may persist `IModelContextRecord` and reconstruct agent memory. Runtime objects, executable tools, handlers and paused continuations remain local to their owner process. Durable registration, run claims, fencing, operation ledgers and redelivery policies belong to consuming applications.

Cancellation bounds waiting but cannot undo an external effect or forcibly stop application code that ignores its signal. Consumers must implement idempotency and fencing at the authoritative write boundary. Application permissions must be resolved again when paused work resumes.

MCP connections and protocol types are owned by `platform-mcp/client`. Its caller-owned transient client uses the same standard MCP Tool and CallToolResult contracts as the existing server infrastructure. `McpToolAdapter` only projects these contracts into intelligence tools; it does not register local MCP handlers or implement a transport. Consumers resolve credentials through typed configuration and close the adapter during owner shutdown or in `finally`. Failed sessions are cleaned up before replacement; remote tool effects are never automatically retried.

## Maintenance

Preserve the public abstract-base and configuration contracts when extending the runtime. Add a state class for a new execution phase, keep shared inference routing in its owner, and use existing intelligence schemas and provider infrastructure. Keep the core entry point free of optional MCP SDK imports.

Run the package's Nx build, lint, typecheck, test and documentation targets. Tests cover observable lifecycle, memory isolation, permission boundaries, streaming, tool execution and real local MCP transport. Generated API pages are rebuilt from source TSDoc; they are never edited manually.
