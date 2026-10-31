---
title: 'Class: IntelligenceProviderAssetUploader'
generated: true
editUrl: false
---

# Class: IntelligenceProviderAssetUploader

Defined in: [libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts#L24)

Uploads provider-managed files and skills behind provider-neutral contracts.

## Constructors

### Constructor

```ts
new IntelligenceProviderAssetUploader(modelResolver): IntelligenceProviderAssetUploader;
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts#L31)

#### Parameters

| Parameter       | Type                        |
| --------------- | --------------------------- |
| `modelResolver` | `IntelligenceModelResolver` |

#### Returns

`IntelligenceProviderAssetUploader`

## Methods

### uploadFile()

```ts
uploadFile(options): Promise<IIntelligenceFileUploadResult>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts#L50)

Uploads a provider-managed file.

#### Parameters

| Parameter | Type                                                                         | Description                           |
| --------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| `options` | [`IIntelligenceFileUploadOptions`](Interface.IIntelligenceFileUploadOptions) | Provider-neutral file upload options. |

#### Returns

`Promise`\<[`IIntelligenceFileUploadResult`](Interface.IIntelligenceFileUploadResult)\>

A normalized provider reference.

---

### uploadSkill()

```ts
uploadSkill(options): Promise<IIntelligenceSkillUploadResult>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceProviderAssetUploader.ts#L82)

Uploads a provider-managed skill.

#### Parameters

| Parameter | Type                                                                           | Description                            |
| --------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `options` | [`IIntelligenceSkillUploadOptions`](Interface.IIntelligenceSkillUploadOptions) | Provider-neutral skill upload options. |

#### Returns

`Promise`\<[`IIntelligenceSkillUploadResult`](Interface.IIntelligenceSkillUploadResult)\>

A normalized provider reference and skill metadata.
