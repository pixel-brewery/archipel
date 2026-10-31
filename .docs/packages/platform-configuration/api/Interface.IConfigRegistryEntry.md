---
title: 'Interface: IConfigRegistryEntry\<TType\>'
generated: true
editUrl: false
---

# Interface: IConfigRegistryEntry\<TType\>

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L13)

Describes a registered configuration entry, including its source module and
whether the entry is required or optional (with a default value).

## Type Parameters

| Type Parameter                            | Default type |
| ----------------------------------------- | ------------ |
| <a id="type-parameter-ttype"></a> `TType` | `unknown`    |

## Properties

### defaultValue?

```ts
readonly defaultValue?: TType;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L34)

An optional default value used when the key is not set.
Only meaningful when `required` is `false`.

---

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L39)

An optional human-readable description of the configuration entry.

---

### key

```ts
readonly key: IConfigKey<TType>;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L17)

The typed configuration key.

---

### module

```ts
readonly module: string;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L22)

The name of the module that registered this key (e.g. `'platform-authentication'`).

---

### required

```ts
readonly required: boolean;
```

Defined in: [libs/platform-configuration/src/ConfigRegistry.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigRegistry.ts#L28)

Whether the configuration value is required at startup.
If `true`, the application should fail fast when the value is missing.
