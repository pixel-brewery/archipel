---
title: 'Interface: IApiStandardSchemaOptions'
generated: true
editUrl: false
---

# Interface: IApiStandardSchemaOptions

Defined in: [libs/platform-bootstrap/src/steps/IApiStandardSchemaOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStandardSchemaOptions.ts#L11)

Standard Schema request-validation and response-serialization options.

Each integration is enabled by default. Set an individual property to
`false`, or set [IApiStepOptions.standardSchema](Interface.IApiStepOptions#standardschema) to `false`, to opt out.

## Properties

### requestValidation?

```ts
readonly requestValidation?: boolean | StandardSchemaValidationPipeOptions;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStandardSchemaOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStandardSchemaOptions.ts#L13)

Standard Schema request validation, or the options forwarded to NestJS.

---

### responseSerialization?

```ts
readonly responseSerialization?: boolean | StandardSchemaSerializerInterceptorOptions;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiStandardSchemaOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiStandardSchemaOptions.ts#L16)

Standard Schema response serialization, or the options forwarded to NestJS.
