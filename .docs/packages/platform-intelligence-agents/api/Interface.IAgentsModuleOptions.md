---
title: 'Interface: IAgentsModuleOptions'
generated: true
editUrl: false
---

# Interface: IAgentsModuleOptions

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentsModuleOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentsModuleOptions.ts#L9)

Consumer modules can provide an inference adapter; the default composes platform-intelligence.

## Properties

### imports?

```ts
readonly imports?: (
  | DynamicModule
  | Type<any>
  | Promise<DynamicModule>
  | ForwardReference<any>)[];
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentsModuleOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentsModuleOptions.ts#L13)

Consumer-configured NestJS modules exporting dependencies of the selected adapter.

---

### inference?

```ts
readonly inference?: Type<AgentInferenceBase>;
```

Defined in: [libs/platform-intelligence-agents/src/interfaces/IAgentsModuleOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence-agents/src/interfaces/IAgentsModuleOptions.ts#L17)

Injectable inference adapter class; defaults to IntelligenceInferenceAdapter.
