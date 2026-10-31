---
title: 'Function: createConfigKey()'
generated: true
editUrl: false
---

# Function: createConfigKey()

```ts
function createConfigKey<TType>(key): IConfigKey<TType>;
```

Defined in: [libs/platform-configuration/src/ConfigKey.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-configuration/src/ConfigKey.ts#L73)

Creates a type-safe config key.

Use this factory function to define all configuration keys in your application.
This ensures you don't scatter raw strings and you assign a type to each key.

## Type Parameters

| Type Parameter                            | Default type |
| ----------------------------------------- | ------------ |
| <a id="type-parameter-ttype"></a> `TType` | `unknown`    |

## Parameters

| Parameter | Type     | Description                                                                                                               |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `key`     | `string` | – The unique string identifier for the config entry. For example: `'DATABASE_URL'`, `'featureX.enabled'`, `'timeout.ms'`. |

## Returns

[`IConfigKey`](Interface.IConfigKey)\<`TType`\>

A branded config key of type `IConfigKey<TType>` where `TType` is
inferred (or specified) as the expected type of the value.

## Example

```typescript
// In some config-keys file
export const DATABASE_URL = createConfigKey<string>('DATABASE_URL');
export const MAX_TIMEOUT_MS = createConfigKey<number>('MAX_TIMEOUT_MS');
export const FEATURE_X_ENABLED = createConfigKey<boolean>('FEATURE_X_ENABLED');
```

Then, when fetching:

```ts
const url = configService.get(DATABASE_URL); // typed as string
const timeout = configService.get(MAX_TIMEOUT_MS); // typed as number
const enabled = configService.get(FEATURE_X_ENABLED); // typed as boolean
```

## Remarks

At runtime the returned object is minimal (just `{ key: string }`) so there is
virtually no overhead. The generic `TType` is only used by TypeScript for stronger
compile-time checking - enabling you to avoid magic strings and untyped fetches.
