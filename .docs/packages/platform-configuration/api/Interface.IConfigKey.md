---
title: 'Interface: IConfigKey\<TType\>'
generated: true
editUrl: false
---

# Interface: IConfigKey\<TType\>

Defined in: [libs/platform-configuration/src/ConfigKey.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigKey.ts#L27)

A type-safe config key that encodes both the config key and the type of its value.

**Why this exists**: In large codebases it is common for configuration values
(environment variables, feature flags, constants) to be accessed directly via
raw strings or via `process.env['SOME_KEY']`. This leads to several issues:
• scattered literal strings making refactoring and discovery difficult,
• lack of compile-time checking for correct key names,
• no guarantee about the type of the value retrieved (string, number, boolean, etc),
• difficulty enforcing a consistent mechanism for configuration access.

To address these, we introduce a **typed config-key abstraction**:
– each config key is defined once (via createConfigKey),
– the `IConfigKey<TType>` carries at compile time the expected type of its value,
– the runtime shape remains minimal (just a `key: string`),
– developers are encouraged to use a central `ConfigService` to fetch values,
rather than scattering `process.env[...]` everywhere.

This improves:
– discoverability (IDE autocomplete, "find usages" works),
– safety (correct key names, correct value types),
– maintainability (single source of truth for config keys),
– clarity (developers see intent: "this key returns a number", "this key returns a boolean").

## Type Parameters

| Type Parameter                            | Default type |
| ----------------------------------------- | ------------ |
| <a id="type-parameter-ttype"></a> `TType` | `unknown`    |

## Properties

### \_type?

```ts
readonly _type?: TType;
```

Defined in: [libs/platform-configuration/src/ConfigKey.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigKey.ts#L32)

Phantom generic to encode the expected value type. This property
is never intended to be used at runtime.

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-configuration/src/ConfigKey.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigKey.ts#L38)

The unique string identifier for the configuration entry.
This typically corresponds to an environment variable name or config store key.
