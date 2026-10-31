---
title: 'Class: ReportingQueryValidationError'
generated: true
editUrl: false
---

# Class: ReportingQueryValidationError

Defined in: [libs/platform-reporting/src/models/errors/ReportingQueryValidationError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingQueryValidationError.ts#L6)

Error thrown when a reporting query contains invalid filter or sort fields.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new ReportingQueryValidationError(datasetId, invalidFields): ReportingQueryValidationError;
```

Defined in: [libs/platform-reporting/src/models/errors/ReportingQueryValidationError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingQueryValidationError.ts#L15)

#### Parameters

| Parameter       | Type                |
| --------------- | ------------------- |
| `datasetId`     | `string`            |
| `invalidFields` | readonly `string`[] |

#### Returns

`ReportingQueryValidationError`

#### Overrides

`Error.constructor`

## Properties

### invalidFields

```ts
readonly invalidFields: readonly string[];
```

Defined in: [libs/platform-reporting/src/models/errors/ReportingQueryValidationError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingQueryValidationError.ts#L9)
