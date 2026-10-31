---
title: 'Interface: IIntelligenceToolRegistry'
generated: true
editUrl: false
---

# Interface: IIntelligenceToolRegistry

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L13)

Contract for the intelligence tool registry.

## Properties

### count

```ts
readonly count: number;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L22)

Gets the number of registered tools.

## Methods

### get()

```ts
get(name): IIntelligenceTool | undefined;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L45)

Gets a tool by name.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `name`    | `string` | The name of the tool to retrieve. |

#### Returns

[`IIntelligenceTool`](Interface.IIntelligenceTool) \| `undefined`

The tool instance, or `undefined` if not found.

---

### has()

```ts
has(name): boolean;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L55)

Checks whether a tool with the given name is registered.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `name`    | `string` | The tool name to check. |

#### Returns

`boolean`

`true` if the tool exists; otherwise `false`.

---

### list()

```ts
list(): readonly IIntelligenceTool[];
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L63)

Returns all registered tools as a readonly array.

#### Returns

readonly [`IIntelligenceTool`](Interface.IIntelligenceTool)[]

Array of all registered tool instances.

---

### listNames()

```ts
listNames(): readonly string[];
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L71)

Returns all registered tool names.

#### Returns

readonly `string`[]

Array of tool names.

---

### register()

```ts
register(tool): void;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L35)

Registers a tool with the registry.

#### Parameters

| Parameter | Type                                               | Description                    |
| --------- | -------------------------------------------------- | ------------------------------ |
| `tool`    | [`IIntelligenceTool`](Interface.IIntelligenceTool) | The tool instance to register. |

#### Returns

`void`

---

### toToolSet()

```ts
toToolSet(): IntelligenceToolSet;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceToolRegistry.ts#L79)

Converts all registered application tools to an Archipel tool set.

#### Returns

[`IntelligenceToolSet`](TypeAlias.IntelligenceToolSet)

A record mapping tool names to provider-neutral definitions.
