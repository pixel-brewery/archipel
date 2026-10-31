---
title: 'Interface: IBlobModuleOptions'
generated: true
editUrl: false
---

# Interface: IBlobModuleOptions

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L19)

## Properties

### configEntries?

```ts
readonly configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L22)

---

### isGlobal?

```ts
readonly isGlobal?: boolean;
```

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L21)

---

### objectPersistence?

```ts
readonly objectPersistence?: Type<BlobObjectPersistenceBase>;
```

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L23)

---

### storageStrategy

```ts
readonly storageStrategy: Type<BlobStorageStrategyBase>;
```

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L20)

---

### variantPersistence?

```ts
readonly variantPersistence?: Type<BlobVariantPersistenceBase>;
```

Defined in: [libs/platform-blob-storage/src/BlobModule.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/BlobModule.ts#L24)
