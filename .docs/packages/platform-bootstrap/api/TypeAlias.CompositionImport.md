---
title: 'Type Alias: CompositionImport'
generated: true
editUrl: false
---

# Type Alias: CompositionImport

```ts
type CompositionImport = Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference<unknown>;
```

Defined in: [libs/platform-bootstrap/src/composition/types/CompositionImport.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/types/CompositionImport.ts#L14)

Represents a valid NestJS module import that can be used during composition.

This type mirrors the allowed import types in NestJS module metadata.
