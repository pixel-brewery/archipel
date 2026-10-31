---
title: 'Class: ConfigKeyNotFoundError'
generated: true
editUrl: false
---

# Class: ConfigKeyNotFoundError

Defined in: [libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts#L6)

Error thrown when a configuration key cannot be resolved.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new ConfigKeyNotFoundError(key, source): ConfigKeyNotFoundError;
```

Defined in: [libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts#L16)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |
| `source`  | `string` |

#### Returns

`ConfigKeyNotFoundError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "CONFIG_KEY_NOT_FOUND" = 'CONFIG_KEY_NOT_FOUND';
```

Defined in: [libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts#L28)

Machine-readable error code.

## Accessors

### key

#### Get Signature

```ts
get key(): string;
```

Defined in: [libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts#L31)

The configuration key that was not found.

##### Returns

`string`

---

### source

#### Get Signature

```ts
get source(): string;
```

Defined in: [libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/errors/ConfigKeyNotFoundError.ts#L36)

The source that was searched (e.g. `'process.env'`, a file path).

##### Returns

`string`
