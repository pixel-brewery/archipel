---
title: 'Function: validateIntelligenceSchema()'
generated: true
editUrl: false
---

# Function: validateIntelligenceSchema()

```ts
function validateIntelligenceSchema<T>(schema, value, label, stage?): Promise<T>;
```

Defined in: [libs/platform-intelligence/src/runtime/validateIntelligenceSchema.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/runtime/validateIntelligenceSchema.ts#L42)

Validates a value through an Archipel schema without exposing the underlying schema library.

Plain JSON schemas are compiled and cached by object identity. Schemas with
an explicit validator and Standard Schema implementations retain ownership
of their validation and normalization behavior.

A value that does not satisfy the schema fails in the given `stage`: pass
`output` when the value is a provider answer, so the failure is reported as
unusable provider output instead of an invalid request. A schema that
cannot be compiled is always an `input` failure, because the application
defined it.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Parameters

| Parameter | Type                                                                   | Default value                        | Description                                                                |
| --------- | ---------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `schema`  | [`IIntelligenceSchema`](TypeAlias.IIntelligenceSchema)\<`T`\>          | `undefined`                          | Provider-neutral Archipel schema.                                          |
| `value`   | `unknown`                                                              | `undefined`                          | Untrusted value to validate and normalize.                                 |
| `label`   | `string`                                                               | `undefined`                          | Context label included in normalized validation errors.                    |
| `stage?`  | [`IntelligenceValidationStage`](TypeAlias.IntelligenceValidationStage) | `IntelligenceValidationStages.Input` | Which side of the provider call the value belongs to. Defaults to `input`. |

## Returns

`Promise`\<`T`\>

The validated and normalized value.

## Throws

When the schema is invalid or the value does not satisfy it.
