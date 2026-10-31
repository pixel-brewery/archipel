---
title: AI Language Generation
description: Generate text and structured output, stream results, use tools, and create agents without leaking provider SDKs.
order: 15
---

# AI Language Generation

`IntelligenceLanguageGenerator` is the provider-neutral language facade. It
owns plain text, schema-constrained objects, streaming, tool execution, result
normalization, retries, cancellation, and timeouts.

Consumer applications depend only on Archipel:

```bash
yarn add @pixel-brewery/archipel-platform-intelligence
```

## Registration

```typescript
import { Module } from '@nestjs/common';
import { IntelligenceCapabilityNames, IntelligenceModule, IntelligenceProviderNames } from '@pixel-brewery/archipel-platform-intelligence';
import { ANTHROPIC_CONFIG_ENTRIES, AnthropicIntelligenceProviderAdapter } from '@pixel-brewery/archipel-platform-intelligence/provider/anthropic';
import { OPENAI_CONFIG_ENTRIES, OpenAIIntelligenceProviderAdapter } from '@pixel-brewery/archipel-platform-intelligence/provider/openai';

@Module({
    imports: [
        IntelligenceModule.register({
            configEntries: [...OPENAI_CONFIG_ENTRIES, ...ANTHROPIC_CONFIG_ENTRIES],
            providerAdapters: [OpenAIIntelligenceProviderAdapter, AnthropicIntelligenceProviderAdapter],
            defaultModels: {
                [IntelligenceCapabilityNames.Language]: {
                    provider: IntelligenceProviderNames.OpenAI,
                    model: 'gpt-5.4-mini',
                },
            },
        }),
    ],
})
export class ApplicationModule {}
```

## Text and Objects

```typescript
const completion = await language.generateText(
    {
        system: 'Answer using the supplied application context only.',
        prompt: 'Summarize the open tasks.',
    },
    {
        maxOutputTokens: 800,
        maxRetries: 2,
    },
);

const structured = await language.generateObject(
    { prompt: 'Classify the customer request.' },
    z.object({
        category: z.enum(['billing', 'technical', 'other']),
        urgency: z.enum(['low', 'normal', 'high']),
    }),
);
```

Applications can provide a model override as
`{ provider: string, model: string }`. They never construct a provider-native
model.

## Durable Provider Boundary

Use a prepared call when an application must make local validation and durable
capacity decisions before any external inference:

```typescript
const prepared = await language.prepareText(prompt, {
    includeRegisteredTools: false,
    tools: approvedTools,
    maxOutputTokens: 800,
    maxSteps: 4,
    maxRetries: 0,
    beforeProviderCall: async (event) => {
        await turnFence.authorizeAndMarkProviderStarted(event);
    },
});

await reservations.reserve(prepared.capacity);
const completion = await prepared.execute();
```

Preparation resolves the model, validates options, snapshots the prompt and
selected tools, and converts their schemas. It does not contact the provider,
and the returned call can be executed only once. The immutable capacity
snapshot describes this captured provider-neutral input and flags opaque or
non-text content for early fail-closed policy decisions.

The awaited `beforeProviderCall` hook runs after the AI SDK has standardized
the current request and immediately before every native provider attempt. The
event reports the standardized context byte size, configured output limit,
provider-call number, text-only status, and provider-tool count. A thrown error
prevents the provider call. Use this hook for durable authorization, capacity,
and idempotency fences; `onStepStart` is telemetry and is not a transactional
boundary. Set `maxRetries: 0` when every external attempt must correspond to a
separately owned durable operation.

## Streaming

```typescript
const stream = await language.streamText({ prompt: 'Explain the result.' });

for await (const delta of stream.textStream) {
    sendToAuthenticatedClient(delta);
}

const finalText = await stream.text;
const usage = await stream.usage;
const stepUsage = await stream.stepUsage;
```

`streamObject()` exposes partial structured output and a validated final object.
All stream iterables and result promises normalize provider failures as
`IntelligenceProviderError`.

The same `beforeProviderCall` boundary applies to both streaming methods.

## Application Tools

```typescript
export class CustomerSearchTool extends IntelligenceToolBase<ICustomerSearchInput, ReadonlyArray<ICustomerSummary>> {
    public override get name(): string {
        return 'customer_search';
    }

    public override get tool() {
        return defineIntelligenceTool({
            description: 'Searches customers visible to the authenticated tenant.',
            inputSchema: createIntelligenceJsonSchema<ICustomerSearchInput>({
                type: 'object',
                properties: { query: { type: 'string' } },
                required: ['query'],
                additionalProperties: false,
            }),
            execute: async ({ query }) => this._customers.search(query),
        });
    }
}
```

Register tools through `IntelligenceModule.register({ tools: [...] })`. Use
`activeToolNames` to constrain a call and `maxSteps` to bound the tool loop.
Tool authorization remains application-owned and must fail closed before data
or side effects are exposed.

Registry tools are included by default and call-local `tools` are merged over
them. Set `includeRegisteredTools: false` for an isolated call that may use only
its local tool set:

```typescript
const result = await language.generateText(
    { prompt: 'Search the approved customer index.' },
    {
        includeRegisteredTools: false,
        tools: { customer_search: customerSearchTool },
        activeToolNames: ['customer_search'],
        maxSteps: 4,
    },
);
```

When `activeToolNames` is supplied, the actual AI SDK tool set is reduced to
exactly those names. Duplicate names and names unavailable after registry/local
composition are rejected as `IntelligenceValidationError` before the provider
call. A registered tool is therefore unavailable when
`includeRegisteredTools: false` unless the call also supplies it locally.

Provider-owned tools are imported from Archipel provider `/tools` subpaths.
They are represented by opaque Archipel definitions; their native SDK types do
not cross into the application.

## Deferred Tool Loading

Applications with large tool catalogs (for example 100+ authorized operations)
can let the model load full tool contracts on demand instead of sending all of
them with every provider request:

```typescript
const result = await language.generateText(
    { prompt: 'Create an invoice for the last completed project.' },
    {
        tools: authorizedOperations,
        deferredToolLoading: {
            initialToolNames: ['project_search'],
            maxToolsPerLoad: 5,
        },
        maxSteps: 8,
    },
);
```

The AI SDK receives every composed tool plus a built-in loader tool, and
Archipel uses the SDK's per-step `activeTools` selection to expose only the
active subset:

1. The first step exposes the loader and `initialToolNames` (default: none).
2. The loader's description lists every tool that is not yet active as
   `name: summary`, using the first sentence of the tool description, trimmed to
   160 characters. Provider-owned tools are listed by name only.
3. The model calls the loader with `{ "names": [...] }`. Known names are
   activated for every later step of the same call; the loader answers
   `{ loaded, alreadyActive, unknown }` (`IIntelligenceDeferredToolLoadResult`).
4. A tool that is not active in a step has no contract in that request and
   cannot execute; a premature call returns a tool error to the model.

| Option             | Default      | Rule                                                                           |
| ------------------ | ------------ | ------------------------------------------------------------------------------ |
| `initialToolNames` | none         | Composed tool names exposed from the first step; no duplicates.                |
| `loaderToolName`   | `load_tools` | Must not be empty or padded with spaces and must not collide with a tool name. |
| `maxToolsPerLoad`  | `10`         | Safe integer from 1 to 50; a loader call requesting more names is rejected.    |

Activation state is created per call and is never shared with another call or
with the local capacity probe of `prepareText()`. `prepareText()` capacity and
`beforeProviderCall` measure the subset that is actually sent, and loader
executions are reported through `onToolExecutionStart` and `onToolExecutionEnd`
like every other tool. The option applies to text, objects, prepared calls,
streams, and agents.

`deferredToolLoading` cannot be combined with `activeToolNames`, requires
`maxSteps` of at least 2 so a loaded tool can be called in a later step, and a
specific `toolChoice` must name an initial tool or the loader. Violations fail
with `IntelligenceValidationError` before the provider is called. Deferred
loading reduces the exposed contract size but is not an authorization boundary:
the model can load every composed tool, so compose only the tools the current
actor may use.

## Agents

`IntelligenceAgentFactory.create()` builds a reusable bounded agent on the same
language facade:

```typescript
const agent = agents.create({
    name: 'researcher',
    instructions: 'Use approved sources and report uncertainty.',
    activeToolNames: ['web_search', 'document_search'],
    maxSteps: 6,
});

const answer = await agent.generate({ prompt: question });
```

Agents do not create a second provider abstraction. They compose language,
tools, model policy, and step limits already owned by Archipel. An agent may
configure either `activeToolNames` or `deferredToolLoading`; a run that
supplies its own `activeToolNames` or `deferredToolLoading` replaces the
agent's configured tool exposure as a whole.

## Results and Failures

Language completions expose provider, model, text, typed output, finish reason,
reasoning text, normalized sources and files, tool calls/results, warnings, and
usage. Usage contains provider-neutral input, output, total, cache-read,
cache-write, reasoning, and available modality counters. A `null` counter means
the provider did not report it and must not be interpreted as measured zero.
A completion that needed several provider calls, such as a tool loop, also
exposes `stepUsage`: the usage of each call in execution order, whose sum is
`usage`. Price each entry separately when the provider prices every request on
its own, for example with long-context rates above an input-token threshold;
the summed usage can cross such a threshold although no single call did.
The default total-operation timeout is 30 seconds.

Provider failures use `IntelligenceProviderError`; invalid prompts and options
use `IntelligenceValidationError`; missing adapters or capability defaults use
`IntelligenceConfigurationError`. `IntelligenceValidationError.stage` is
`input` for a prompt, option, or tool configuration rejected before any provider
call and `output` when the provider's answer violates the prompt's output
schema, so an application can tell its own invalid request from unusable
provider output.
