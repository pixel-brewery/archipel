---
title: 'Interface: IProviderDecision'
generated: true
editUrl: false
---

# Interface: IProviderDecision

Defined in: [libs/platform-bootstrap/src/composition/types/IProviderDecision.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/types/IProviderDecision.ts#L12)

Represents the result of a provider composition decision.

## Properties

### imports

```ts
readonly imports: readonly CompositionImport[];
```

Defined in: [libs/platform-bootstrap/src/composition/types/IProviderDecision.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/types/IProviderDecision.ts#L27)

The modules to import when [shouldImport](#shouldimport) is `true`.

When [shouldImport](#shouldimport) is `false`, this array should be empty or omitted.

---

### shouldImport

```ts
readonly shouldImport: boolean;
```

Defined in: [libs/platform-bootstrap/src/composition/types/IProviderDecision.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/composition/types/IProviderDecision.ts#L18)

Whether the provider should be imported into the application module graph.
