---
title: 'Interface: IMcpModuleOptions'
generated: true
editUrl: false
---

# Interface: IMcpModuleOptions

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts#L4)

Options for configuring the MCP module.

## Properties

### capabilities?

```ts
readonly capabilities?: {
  logging?: Record<string, unknown>;
  prompts?: {
     listChanged?: boolean;
  };
  resources?: {
     listChanged?: boolean;
     subscribe?: boolean;
  };
  tools?: {
     listChanged?: boolean;
  };
};
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts#L12)

Optional server capabilities to advertise.

#### logging?

```ts
readonly logging?: Record<string, unknown>;
```

#### prompts?

```ts
readonly prompts?: {
  listChanged?: boolean;
};
```

##### prompts.listChanged?

```ts
readonly listChanged?: boolean;
```

#### resources?

```ts
readonly resources?: {
  listChanged?: boolean;
  subscribe?: boolean;
};
```

##### resources.listChanged?

```ts
readonly listChanged?: boolean;
```

##### resources.subscribe?

```ts
readonly subscribe?: boolean;
```

#### tools?

```ts
readonly tools?: {
  listChanged?: boolean;
};
```

##### tools.listChanged?

```ts
readonly listChanged?: boolean;
```

---

### instructions?

```ts
readonly instructions?: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts#L20)

Optional server instructions for clients.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts#L6)

Name of the MCP server (exposed to clients).

---

### version

```ts
readonly version: string;
```

Defined in: [libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mcp/src/interfaces/IMcpModuleOptions.ts#L9)

Version of the MCP server (exposed to clients).
