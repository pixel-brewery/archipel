---
title: 'Interface: ISwaggerFeatureMetadata'
generated: true
editUrl: false
---

# Interface: ISwaggerFeatureMetadata

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L37)

Describes a single Swagger feature module that should be exposed as its own
OpenAPI document via the multi-document setup.

## Properties

### description

```ts
readonly description: string;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L51)

Short description shown below the title in Swagger UI.

---

### extraModels?

```ts
readonly extraModels?: readonly Type<unknown>[];
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L71)

Model classes that belong to this feature's OpenAPI contract even when no
controller operation references them directly.

Referenced child schemas are retained recursively in the feature document.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L42)

Unique machine-readable identifier for this feature (e.g. `'tip'`, `'user'`).
Used to deduplicate registrations and to derive the default [path](#path).

---

### path?

```ts
readonly path?: string;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L88)

URL path segment where the Swagger UI for this feature is served.
Defaults to `docs/{name}` when omitted.

#### Example

```ts
`'docs/tips'`;
```

---

### strictModels?

```ts
readonly strictModels?: readonly Type<unknown>[];
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L80)

Root DTOs whose complete reachable object graph is emitted as a closed
contract and synchronized with portable `class-validator` constraints.

Strict models are automatically included in the generated document; they
do not need to be repeated in [extraModels](#extramodels).

---

### tag

```ts
readonly tag: string;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L57)

Primary OpenAPI tag applied to every controller that belongs to this feature.
Controllers are grouped under this tag in the generated document.

---

### tags

```ts
readonly tags: string[];
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L63)

Additional OpenAPI tags to include in the generated document.
Useful when a feature module spans multiple controller groups.

---

### title

```ts
readonly title: string;
```

Defined in: [libs/platform-openapi/src/decorators/SwaggerFeature.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/SwaggerFeature.ts#L48)

Human-readable title displayed in the Swagger UI header
(e.g. `'My App API - Tips'`).
