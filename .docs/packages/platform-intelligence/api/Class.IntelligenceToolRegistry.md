---
title: 'Class: IntelligenceToolRegistry'
generated: true
editUrl: false
---

# Class: IntelligenceToolRegistry

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L21)

Registry for class-based intelligence tools.

The registry keeps application tools provider-neutral and supplies them to
Archipel language generation.

## Implements

- [`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry)

## Constructors

### Constructor

```ts
new IntelligenceToolRegistry(maxTools?): IntelligenceToolRegistry;
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L29)

#### Parameters

| Parameter   | Type     | Default value                                 |
| ----------- | -------- | --------------------------------------------- |
| `maxTools?` | `number` | `IntelligenceToolRegistry._DEFAULT_MAX_TOOLS` |

#### Returns

`IntelligenceToolRegistry`

## Accessors

### count

#### Get Signature

```ts
get count(): number;
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L55)

Gets the number of registered tools.

##### Returns

`number`

Gets the number of registered tools.

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`count`](Interface.IIntelligenceToolRegistry#count)

## Methods

### get()

```ts
get(name): IIntelligenceTool | undefined;
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:116](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L116)

Gets a tool by name.

#### Parameters

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `name`    | `string` | The name of the tool to retrieve. |

#### Returns

[`IIntelligenceTool`](Interface.IIntelligenceTool) \| `undefined`

The tool instance, or `undefined` if not found.

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`get`](Interface.IIntelligenceToolRegistry#get)

---

### has()

```ts
has(name): boolean;
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:128](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L128)

Checks whether a tool with the given name is registered.

#### Parameters

| Parameter | Type     | Description             |
| --------- | -------- | ----------------------- |
| `name`    | `string` | The tool name to check. |

#### Returns

`boolean`

`true` if the tool exists; otherwise `false`.

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`has`](Interface.IIntelligenceToolRegistry#has)

---

### list()

```ts
list(): readonly IIntelligenceTool[];
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:138](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L138)

Returns all registered tools as a readonly array.

#### Returns

readonly [`IIntelligenceTool`](Interface.IIntelligenceTool)[]

Array of all registered tool instances.

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`list`](Interface.IIntelligenceToolRegistry#list)

---

### listNames()

```ts
listNames(): readonly string[];
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:148](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L148)

Returns all registered tool names.

#### Returns

readonly `string`[]

Array of tool names.

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`listNames`](Interface.IIntelligenceToolRegistry#listnames)

---

### register()

```ts
register(tool): void;
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L72)

Registers a tool with the registry.

Tools with duplicate names replace the existing registration.

#### Parameters

| Parameter | Type                                               | Description                    |
| --------- | -------------------------------------------------- | ------------------------------ |
| `tool`    | [`IIntelligenceTool`](Interface.IIntelligenceTool) | The tool instance to register. |

#### Returns

`void`

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`register`](Interface.IIntelligenceToolRegistry#register)

---

### toToolSet()

```ts
toToolSet(): IntelligenceToolSet;
```

Defined in: [libs/platform-intelligence/src/IntelligenceToolRegistry.ts:167](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceToolRegistry.ts#L167)

Converts all registered application tools to an Archipel tool set.

#### Returns

[`IntelligenceToolSet`](TypeAlias.IntelligenceToolSet)

A record mapping tool names to provider-neutral definitions.

#### Example

```typescript
const result = await languageGenerator.generateText({
    model: { provider: 'openai', model: 'gpt-4o' },
    tools: registry.toToolSet(),
    prompt: 'Find user John Doe',
});
```

#### Implementation of

[`IIntelligenceToolRegistry`](Interface.IIntelligenceToolRegistry).[`toToolSet`](Interface.IIntelligenceToolRegistry#totoolset)
