---
title: 'Function: translateUniqueConstraintViolation()'
generated: true
editUrl: false
---

# Function: translateUniqueConstraintViolation()

```ts
function translateUniqueConstraintViolation<TResult>(operation, createError): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/failures/translateUniqueConstraintViolation.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/failures/translateUniqueConstraintViolation.ts#L34)

Runs a write and reports a unique constraint violation as the caller's error.

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` |

## Parameters

| Parameter     | Type                             | Description                                    |
| ------------- | -------------------------------- | ---------------------------------------------- |
| `operation`   | () => `PromiseLike`\<`TResult`\> | The write guarded by a unique constraint.      |
| `createError` | (`violation`) => `Error`         | Creates the caller's error from the violation. |

## Returns

`Promise`\<`TResult`\>

The result of the write.

## Remarks

A pre-check (for example "is the name still free?") cannot rule out a
concurrent write that stores the same value first; the unique constraint
stays the final guard. Wrap the guarded write so that this race answers with
the same caller-defined error as the pre-check instead of an uncoded database
failure. Every other failure is rethrown unchanged.

## Example

```typescript
return query<LocationDelegate, LocationModel>('createLocation', (model) =>
    translateUniqueConstraintViolation(
        () => model.create({ data }),
        () => new LocationNameAlreadyExistsError(data.name),
    ),
);
```
