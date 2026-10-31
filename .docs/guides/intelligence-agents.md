---
title: Intelligence Agent Runtime
description: Compose generic agents, event reactions and bounded loops in any NestJS application.
---

# Intelligence Agent Runtime

Use [Intelligence Agents](/packages/platform-intelligence-agents/) when an application needs multiple participating agents/humans, semantic event reactions or interception before individual tool effects. Use the existing IntelligenceAgentFactory for a single model/tool loop.

The [package guide](/packages/platform-intelligence-agents/) contains the complete module composition, participant, event, memory, approval, streaming, lifecycle, resource-bound and MCP contracts. The package does not add HTTP routes, application records, a scheduler or durable work claims. Each consuming application owns these responsibilities and may expose its own transport adapter.

## First integration

1. Import the consumer-configured IntelligenceModule through AgentsModule.
2. Inject AgentRuntimeFactory and define the runtime owner lifetime.
3. Materialize generic agent/human identities from application records.
4. Supply existing tools with current authorization, approval and idempotency guards.
5. Dispatch one work item with a correlation identifier and an abort signal.
6. Record per-provider usage and audit evidence through the consumer-owned sink/ledger.
7. Drain events and dispose the runtime and any MCP registries.

A distributed hub additionally owns registration persistence, schedules, durable run claims, fencing, resumable work and redelivery policy. Registered agents do no inference work until a caller or event reaction starts a bounded run.
