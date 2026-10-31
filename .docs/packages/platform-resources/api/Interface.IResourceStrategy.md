---
title: 'Interface: IResourceStrategy'
generated: true
editUrl: false
---

# Interface: IResourceStrategy

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L8)

Strategy for loading resources from a specific source.

## Properties

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L12)

The unique name of this strategy.

## Methods

### exists()

```ts
exists(key): boolean;
```

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L36)

Checks if a resource exists without loading it.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

`boolean`

True if the resource exists

---

### existsAsync()

```ts
existsAsync(key): Promise<boolean>;
```

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L44)

Checks if a resource exists without loading it (asynchronous).

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

`Promise`\<`boolean`\>

Promise resolving to true if the resource exists

---

### load()

```ts
load(key): IResourceResult | undefined;
```

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L20)

Loads a resource by its key.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

[`IResourceResult`](Interface.IResourceResult) \| `undefined`

The resource result or undefined if not found

---

### loadAsync()

```ts
loadAsync(key): Promise<IResourceResult | undefined>;
```

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L28)

Loads a resource by its key (asynchronous).

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `key`     | `string` | The resource key/identifier |

#### Returns

`Promise`\<[`IResourceResult`](Interface.IResourceResult) \| `undefined`\>

Promise resolving to the resource result or undefined if not found

---

### whatDoIHave()

```ts
whatDoIHave(): void;
```

Defined in: [libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/strategies/abstracts/IResourceStrategy.ts#L49)

List all files and folders in the base paths for debugging purposes.

#### Returns

`void`
