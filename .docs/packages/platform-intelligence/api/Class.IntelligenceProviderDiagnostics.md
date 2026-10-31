---
title: 'Class: IntelligenceProviderDiagnostics'
generated: true
editUrl: false
---

# Class: IntelligenceProviderDiagnostics

Defined in: [libs/platform-intelligence/src/IntelligenceProviderDiagnostics.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderDiagnostics.ts#L18)

Performs bounded, provider-neutral provider availability diagnostics.

## Constructors

### Constructor

```ts
new IntelligenceProviderDiagnostics(modelResolver): IntelligenceProviderDiagnostics;
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderDiagnostics.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderDiagnostics.ts#L28)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceProviderDiagnostics`

## Methods

### probe()

```ts
probe(
   capability?,
   model?,
   timeoutMs?
): Promise<IIntelligenceProviderProbeResult>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderDiagnostics.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderDiagnostics.ts#L40)

#### Parameters

| Parameter     | Type                                                                   | Default value                          |
| ------------- | ---------------------------------------------------------------------- | -------------------------------------- |
| `capability?` | [`IntelligenceCapability`](TypeAlias.IntelligenceCapability)           | `IntelligenceCapabilityNames.Language` |
| `model?`      | [`IIntelligenceModelReference`](Interface.IIntelligenceModelReference) | `undefined`                            |
| `timeoutMs?`  | `number`                                                               | `undefined`                            |

#### Returns

`Promise`\<[`IIntelligenceProviderProbeResult`](Interface.IIntelligenceProviderProbeResult)\>
