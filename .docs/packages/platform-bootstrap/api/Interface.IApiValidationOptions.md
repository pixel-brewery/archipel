---
title: 'Interface: IApiValidationOptions'
generated: true
editUrl: false
---

# Interface: IApiValidationOptions

Defined in: [libs/platform-bootstrap/src/steps/IApiValidationOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiValidationOptions.ts#L6)

Validation options used by the generic Archipel API bootstrap step.

## Properties

### enableImplicitConversion?

```ts
readonly enableImplicitConversion?: boolean;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiValidationOptions.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiValidationOptions.ts#L17)

Whether class-transformer should enable implicit primitive conversion.

---

### forbidNonWhitelisted?

```ts
readonly forbidNonWhitelisted?: boolean;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiValidationOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiValidationOptions.ts#L11)

Whether stripped properties should produce validation errors.

---

### transform?

```ts
readonly transform?: boolean;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiValidationOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiValidationOptions.ts#L14)

Whether payloads should be transformed into DTO class instances.

---

### whitelist?

```ts
readonly whitelist?: boolean;
```

Defined in: [libs/platform-bootstrap/src/steps/IApiValidationOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/IApiValidationOptions.ts#L8)

Whether properties without validation decorators are stripped.
