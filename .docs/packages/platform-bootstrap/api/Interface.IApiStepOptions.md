---
title: 'Interface: IApiStepOptions'
generated: true
editUrl: false
---

# Interface: IApiStepOptions

Defined in: [libs/platform-bootstrap/src/steps/IApiStepOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStepOptions.ts#L9)

Options for the generic Archipel API bootstrap step.

## Properties

### prefix?

```ts
readonly prefix?: string;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStepOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStepOptions.ts#L11)

Global route prefix, for example `api`.

---

### problemDetails?

```ts
readonly problemDetails?: boolean;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStepOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStepOptions.ts#L14)

Whether to enable RFC 7807 problem-detail error responses.

---

### repositoryErrors?

```ts
readonly repositoryErrors?: boolean;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStepOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStepOptions.ts#L17)

Whether to enable repository error mapping.

---

### standardSchema?

```ts
readonly standardSchema?:
  | boolean
  | IApiStandardSchemaOptions;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStepOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStepOptions.ts#L23)

Standard Schema request-validation and response-serialization behavior.

---

### validation?

```ts
readonly validation?: boolean | IApiValidationOptions;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStepOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStepOptions.ts#L20)

Validation behavior for request DTOs.
